-- ============================================================
-- 가상매매(단타왕) + 커뮤니티 + 매매 가시성 (MAX 티어)
--
-- 1. profiles.subscription_status 값에 'max' 추가 (제약 없으므로 별도 변경 불필요)
-- 2. paper_trades       — 가상매매 거래 기록 (단타: 매수→매도 1회 사이클)
-- 3. community_posts    — 게시글
-- 4. community_comments — 댓글
--
-- RLS 원칙:
--   읽기  — 로그인 누구나 (Pro도 보기 가능)
--   쓰기  — 본인만 (티어 체크는 API 라우트에서 'max' 검증)
--          → DB 단에서 티어 체크하면 RLS 정책이 비싸짐 (profiles JOIN 필요).
--            서버 라우트에서 1회 체크가 깔끔.
-- ============================================================

-- ── paper_trades ──────────────────────────────────────────────
-- 단타 사이클 1건 = 1행. 매수 시 INSERT, 매도 시 UPDATE.
-- season_ym (YYYY-MM) 컬럼으로 월별 시즌 분리 — 매월 1일 0시(KST)에
-- 자연스럽게 새 시즌이 시작됨. 과거 시즌 기록은 보존.
CREATE TABLE IF NOT EXISTS paper_trades (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_ym   text        NOT NULL,             -- '2026-05' (KST 기준)
  trade_date  date        NOT NULL,             -- 'YYYY-MM-DD' (KST)
  ticker      text        NOT NULL,
  stock_name  text        NOT NULL,
  buy_price   numeric     NOT NULL,
  buy_at      timestamptz NOT NULL DEFAULT now(),
  sell_price  numeric,                          -- NULL이면 보유 중
  sell_at     timestamptz,
  pnl_pct     numeric                           -- (sell - buy) / buy * 100, 매도 시 자동 채움
);

-- 인덱스
CREATE INDEX IF NOT EXISTS paper_trades_user_season_idx ON paper_trades(user_id, season_ym);
CREATE INDEX IF NOT EXISTS paper_trades_season_idx      ON paper_trades(season_ym);
CREATE INDEX IF NOT EXISTS paper_trades_ticker_open_idx ON paper_trades(ticker)
  WHERE sell_at IS NULL;
-- 하루 1종목 제약: 같은 user의 같은 trade_date에 row 1개만 (보유 중이든 청산이든)
CREATE UNIQUE INDEX IF NOT EXISTS paper_trades_user_date_unique
  ON paper_trades(user_id, trade_date);

ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;

-- 본인 거래는 본인만 SELECT
CREATE POLICY "paper_trades_select_own"
  ON paper_trades FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- service_role 만 INSERT/UPDATE/DELETE (티어 체크는 API 라우트에서)
CREATE POLICY "paper_trades_insert_service"
  ON paper_trades FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "paper_trades_update_service"
  ON paper_trades FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "paper_trades_delete_service"
  ON paper_trades FOR DELETE
  TO service_role
  USING (true);


-- ── community_posts ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  body        text        NOT NULL,
  comment_cnt integer     NOT NULL DEFAULT 0,   -- 댓글 수 캐시 (트리거 갱신)
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_posts_created_idx ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_user_idx    ON community_posts(user_id);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 모든 로그인 유저가 읽기 가능 (Pro·MAX 둘 다)
CREATE POLICY "community_posts_select_authenticated"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

-- 쓰기는 service_role 통한 API 라우트에서만 (티어 체크 후)
CREATE POLICY "community_posts_insert_service"
  ON community_posts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "community_posts_update_service"
  ON community_posts FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "community_posts_delete_service"
  ON community_posts FOR DELETE
  TO service_role
  USING (true);


-- ── community_comments ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_comments (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid        NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_comments_post_idx    ON community_comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS community_comments_user_idx    ON community_comments(user_id);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_comments_select_authenticated"
  ON community_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "community_comments_insert_service"
  ON community_comments FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "community_comments_update_service"
  ON community_comments FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "community_comments_delete_service"
  ON community_comments FOR DELETE
  TO service_role
  USING (true);


-- ── comment_cnt 자동 갱신 트리거 ─────────────────────────────
CREATE OR REPLACE FUNCTION public.bump_comment_cnt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comment_cnt = comment_cnt + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comment_cnt = GREATEST(0, comment_cnt - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS community_comments_count_trg ON community_comments;
CREATE TRIGGER community_comments_count_trg
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION public.bump_comment_cnt();
