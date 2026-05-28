import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

// 브라우저: createBrowserClient (쿠키 기반) → PKCE code verifier가 쿠키에 저장되어
//           OAuth redirect 후에도 유실되지 않음 (localStorage는 Safari ITP 등으로 유실 가능)
// 서버(API route 등): createClient (anon key, DB 쿼리 전용)
// detectSessionInUrl: false → 자동 URL 코드 교환 비활성화
// auth/callback 페이지에서 수동으로 exchangeCodeForSession을 호출하므로,
// 자동 교환을 켜두면 "code already used" 오류가 발생함
export const supabase =
  typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseAnonKey, {
        auth: { detectSessionInUrl: false },
      })
    : createClient(supabaseUrl, supabaseAnonKey);
