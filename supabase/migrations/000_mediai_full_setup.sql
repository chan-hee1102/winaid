-- ============================================================
-- MediAI 전체 초기 설정 SQL
-- 새 Supabase 프로젝트에서 이 파일 하나만 실행하면 됩니다
-- Supabase 대시보드 → SQL Editor → 전체 붙여넣기 → Run
-- ============================================================


-- ── 1. profiles 테이블 ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                text,
  subscription_status text        NOT NULL DEFAULT 'trial',
  trial_ends_at       timestamptz,
  pro_expires_at      timestamptz,
  role                text        NOT NULL DEFAULT 'user',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_service" ON public.profiles
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "profiles_update_service" ON public.profiles
  FOR UPDATE TO service_role USING (true);

CREATE POLICY "profiles_select_service" ON public.profiles
  FOR SELECT TO service_role USING (true);


-- ── 2. 신규 가입 트리거 (가입 즉시 14일 체험 부여) ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_name text;
BEGIN
  meta_name := COALESCE(
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'preferred_username',
    ''
  );

  BEGIN
    INSERT INTO public.profiles (id, name, subscription_status, trial_ends_at, role)
    VALUES (NEW.id, meta_name, 'trial', now() + interval '14 days', 'user')
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 3. generation_logs 테이블 (AI 생성 이력 & 사용량 추적) ──
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature       text        NOT NULL,   -- 'review_reply' | 'content_generator' | 'faq_generator'
  hospital_type text,
  content_type  text,
  input_preview text,                   -- 입력 텍스트 앞 100자
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_select_own" ON public.generation_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "logs_insert_own" ON public.generation_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logs_all_service" ON public.generation_logs
  FOR ALL TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_generation_logs_user_date
  ON public.generation_logs (user_id, created_at DESC);


-- ── 4. 구독 만료 처리 함수 (API에서 호출) ────────────────────
-- 별도 처리 없이 profiles 테이블의 subscription_status를 'free'로 업데이트
-- /api/user/expire-subscription 라우트에서 service_role로 직접 UPDATE
