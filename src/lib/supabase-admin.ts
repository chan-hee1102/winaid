// 서버 전용 Supabase Admin 클라이언트 (service_role 키)
// 클라이언트 컴포넌트에서 절대 import 금지
import { createClient } from '@supabase/supabase-js';

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[supabase-admin] 환경변수 누락:', {
      url: !!url,
      key: !!key,
    });
  }

  return createClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder_service_key',
  );
}

export const supabaseAdmin = createAdminClient();
