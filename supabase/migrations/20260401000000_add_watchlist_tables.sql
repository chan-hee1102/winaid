-- ============================================================
-- 관심종목 테이블 생성 + RLS 정책 설정
-- watchlist_groups, watchlist_items
-- ============================================================

-- ── watchlist_groups ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS watchlist_groups (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  color      text NOT NULL DEFAULT '#6366f1',
  position   integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE watchlist_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchlist_groups_select_own"
  ON watchlist_groups FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "watchlist_groups_insert_own"
  ON watchlist_groups FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "watchlist_groups_update_own"
  ON watchlist_groups FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "watchlist_groups_delete_own"
  ON watchlist_groups FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ── watchlist_items ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS watchlist_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id   uuid REFERENCES watchlist_groups(id) ON DELETE SET NULL,
  stock_code text NOT NULL,
  stock_name text NOT NULL,
  added_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchlist_items_select_own"
  ON watchlist_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "watchlist_items_insert_own"
  ON watchlist_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "watchlist_items_update_own"
  ON watchlist_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "watchlist_items_delete_own"
  ON watchlist_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
