-- ============================================================
-- 회원가입 트리거 버그 수정
-- 1. profiles.birth_date 를 nullable 로 변경
--    (OAuth 가입자는 생년월일을 못 받으므로 onboarding 에서 보완)
-- 2. 트리거 함수에서 text → date 명시적 캐스팅
-- 3. 트리거 실패가 가입 자체를 막지 않도록 EXCEPTION 처리
-- ============================================================

-- ── birth_date NOT NULL 해제 ──────────────────────────────────
ALTER TABLE public.profiles
  ALTER COLUMN birth_date DROP NOT NULL;

-- ── 트리거 함수 재정의 ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_name       text;
  meta_birth_text text;
  parsed_date     date;
BEGIN
  -- 이름: 이메일 가입은 'name', OAuth 는 'full_name'/'name'/'preferred_username'
  meta_name := COALESCE(
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'preferred_username',
    ''
  );

  -- 생년월일: 텍스트로 추출 후, 유효한 날짜면 date 로 캐스팅, 아니면 NULL
  meta_birth_text := NULLIF(NEW.raw_user_meta_data ->> 'birth_date', '');
  IF meta_birth_text IS NOT NULL THEN
    BEGIN
      parsed_date := meta_birth_text::date;
    EXCEPTION WHEN OTHERS THEN
      parsed_date := NULL;
    END;
  END IF;

  -- 트리거 실패가 auth.users INSERT 자체를 막지 않도록 보호
  -- (실패해도 onboarding 페이지에서 행을 보완하거나 만들 수 있음)
  BEGIN
    INSERT INTO public.profiles (
      id, name, birth_date, subscription_status, trial_ends_at, role
    )
    VALUES (
      NEW.id,
      meta_name,
      parsed_date,
      'trial',
      now() + interval '7 days',
      'user'
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: profile insert failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;
