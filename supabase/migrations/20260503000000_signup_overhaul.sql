-- ============================================================
-- 회원가입 개편
-- 1. profiles 자동 생성 트리거 (auth.users INSERT 시)
-- 2. 트라이얼 기본 7일 부여 (회원가입 즉시)
-- 3. 메타데이터(name, birth_date) → profiles 컬럼 매핑
-- ============================================================

-- ── 트리거 함수 ──────────────────────────────────────────────
-- auth.users INSERT 직후 profiles 행을 자동 생성한다.
-- raw_user_meta_data 에서 이름/생년월일을 꺼낸다.
--   - 이메일 가입: signUp 시 options.data 로 전달한 값이 들어옴
--   - OAuth 가입: provider 가 채워주는 full_name / name 을 fallback 으로 사용
-- trial_ends_at 은 가입 시각 + 7일.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_name       text;
  meta_birth_date text;
BEGIN
  meta_name := COALESCE(
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'preferred_username',
    ''
  );

  meta_birth_date := NEW.raw_user_meta_data ->> 'birth_date';

  INSERT INTO public.profiles (
    id,
    name,
    birth_date,
    subscription_status,
    trial_ends_at,
    role
  )
  VALUES (
    NEW.id,
    meta_name,
    meta_birth_date,
    'trial',
    now() + interval '7 days',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ── 트리거 등록 ──────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
