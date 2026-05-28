// 서버 컴포넌트 전용 — 쿠키에서 세션을 읽어 auth.getUser() 사용 가능
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서 set은 무시됨 (읽기 전용 컨텍스트)
          }
        },
      },
    }
  );
}

/**
 * Authorization: Bearer <token> 헤더에서 유저를 인증하고
 * 해당 토큰으로 인증된 Supabase 클라이언트를 반환합니다.
 * createClient (localStorage 기반) 환경에서 쿠키 없이 서버 인증에 사용합니다.
 */
export async function createSupabaseWithBearer(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '').trim();
  if (!token) return { supabase: null, user: null };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}
