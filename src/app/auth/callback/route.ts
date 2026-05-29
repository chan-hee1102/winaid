import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code      = searchParams.get('code');
  const type      = searchParams.get('type');
  const tokenHash = searchParams.get('token_hash');

  const forwardedHost  = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  // OAuth 오류 응답 (Google/Supabase에서 에러 반환)
  if (searchParams.get('error')) {
    console.error('[auth/callback] OAuth 오류:', searchParams.get('error'), searchParams.get('error_description'));
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  // Next.js 16에서 Route Handler의 cookies().set()은 ReadonlyRequestCookiesError를 던짐
  // (phase === 'action' 즉 Server Action에서만 쿠키 수정 허용)
  // → cookiesToApply 배열에 버퍼링 후 NextResponse에 직접 적용하는 방식 사용
  // 참고: _notifyAllSubscribers는 await되므로 setAll은 exchangeCodeForSession 반환 전에 호출됨
  const cookiesToApply: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(c => cookiesToApply.push(c));
        },
      },
    }
  );

  function makeResponse(redirectPath: string) {
    const res = NextResponse.redirect(`${origin}${redirectPath}`);
    cookiesToApply.forEach(({ name, value, options }) => {
      res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2]);
    });
    return res;
  }

  // ── 비밀번호 재설정 플로우 ──────────────────────────────────────────────────
  if (type === 'recovery') {
    if (tokenHash) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery',
      });
      if (error) {
        console.error('[auth/callback] recovery OTP 실패:', error.message);
        return makeResponse('/login');
      }
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('[auth/callback] recovery code 교환 실패:', error.message);
        return makeResponse('/login');
      }
    }
    return makeResponse('/reset-password');
  }

  // ── 이메일 가입 인증 플로우 (token_hash 방식) ───────────────────────────────
  // Supabase가 가입 인증 메일에서 type=signup&token_hash=... 형태로 보냄
  if (type === 'signup' && tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'signup',
    });
    if (error) {
      console.error('[auth/callback] signup OTP 실패:', error.message);
      return makeResponse('/login?error=exchange');
    }
    return makeResponse('/');
  }

  // ── OAuth PKCE 플로우 + 이메일 가입 인증(code 방식) 통합 ──────────────────
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      console.error('[auth/callback] code 교환 실패:', error?.message ?? 'user is null');
      return makeResponse('/login?error=exchange');
    }

    // 프로필은 트리거(handle_new_user)가 자동 생성한다.
    // 다만 OAuth 가입자는 birth_date 가 비어있을 수 있으므로
    // 필수 필드 누락 시 /onboarding 으로 보내 보완을 받는다.
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, birth_date')
      .eq('id', data.user.id)
      .maybeSingle();

    const isComplete = !!(profile?.name && profile?.birth_date);
    return makeResponse(isComplete ? '/' : '/onboarding');
  }

  return makeResponse('/login');
}
