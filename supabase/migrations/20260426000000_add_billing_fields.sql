-- ============================================================
-- 포트원 V2 정기결제 연동 필드 추가
-- billing_key, next_billing_date, portone_schedule_id, subscription_cancel_at
-- payment_logs 테이블 생성
-- ============================================================

-- ── profiles 테이블에 빌링 컬럼 추가 ─────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS billing_key             text,
  ADD COLUMN IF NOT EXISTS next_billing_date       timestamptz,
  ADD COLUMN IF NOT EXISTS portone_schedule_id     text,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at  timestamptz;

-- ── payment_logs 테이블 ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id      text        NOT NULL UNIQUE,
  schedule_id     text,
  amount          integer     NOT NULL DEFAULT 19900,
  status          text        NOT NULL DEFAULT 'pending',
  portone_tx_id   text,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_logs_select_own"
  ON payment_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
