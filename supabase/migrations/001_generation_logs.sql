-- MediAI generation_logs 테이블
-- profiles 테이블은 kostock Supabase 프로젝트에 이미 존재함 (재사용)
-- 이 SQL만 Supabase 대시보드 SQL Editor에서 실행하면 됨

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

-- 일별 사용량 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_date
  ON public.generation_logs (user_id, created_at DESC);
