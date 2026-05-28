-- ============================================================
-- profiles 테이블에 체험 기간 및 관리자 권한 컬럼 추가
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at  timestamptz,
  ADD COLUMN IF NOT EXISTS role           text NOT NULL DEFAULT 'user';

-- 기존 유저 subscription_status NULL → 'free' 정규화
UPDATE profiles
  SET subscription_status = 'free'
WHERE subscription_status IS NULL;

-- ============================================================
-- ⚠️ 관리자 계정 설정 (이메일을 실제 주소로 바꾼 후 직접 실행)
-- ============================================================
-- UPDATE profiles
--   SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'your@email.com'
-- );
