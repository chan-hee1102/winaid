'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'kakao' | null>(null);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'oauth') setError('소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    else if (err === 'exchange') setError('인증 처리에 실패했습니다. 다시 시도해주세요.');
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(translateLoginError(error.message));
      setLoading(false);
      return;
    }

    // 로그인 성공 → 홈으로
    router.replace('/');
    router.refresh();
  };

  const handleOAuth = async (provider: 'google' | 'kakao') => {
    setOauthLoading(provider);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900">
              Medi<span className="text-indigo-600">AI</span>
            </h1>
          </Link>
          <p className="text-slate-500 text-sm mt-2 font-medium">병원 AI 마케팅 어시스턴트</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                inputMode="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  비밀번호
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 tracking-tight"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '로그인'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">또는</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading || oauthLoading !== null}
              className="w-full py-3 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {oauthLoading === 'google' ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <>
                  <GoogleIcon /> Google로 로그인
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('kakao')}
              disabled={loading || oauthLoading !== null}
              className="w-full py-3 bg-[#FEE500] text-sm font-bold text-[#191919] rounded-xl hover:bg-[#f5dc00] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {oauthLoading === 'kakao' ? (
                <div className="w-4 h-4 border-2 border-[#191919]/30 border-t-[#191919] rounded-full animate-spin" />
              ) : (
                <>
                  <KakaoIcon /> 카카오로 로그인
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function translateLoginError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid_credentials') || m.includes('invalid')) {
    return '이메일 또는 비밀번호가 올바르지 않아요.';
  }
  if (m.includes('email not confirmed') || m.includes('not confirmed')) {
    return '이메일 인증이 아직 완료되지 않았어요. 메일함(스팸함 포함)을 확인해주세요.';
  }
  if (m.includes('rate') || m.includes('too many')) {
    return '로그인 시도가 너무 많아요. 잠시 후 다시 시도해주세요.';
  }
  if (m.includes('user not found')) {
    return '가입되지 않은 이메일이에요. 회원가입을 먼저 진행해주세요.';
  }
  if (m.includes('network') || m.includes('failed to fetch')) {
    return '네트워크 연결을 확인하고 다시 시도해주세요.';
  }
  return '로그인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path fill="#191919" d="M9 1.5C4.86 1.5 1.5 4.09 1.5 7.27c0 2.03 1.35 3.82 3.38 4.84l-.86 3.2a.28.28 0 0 0 .43.3l3.74-2.48c.27.03.54.04.81.04 4.14 0 7.5-2.59 7.5-5.77S13.14 1.5 9 1.5z"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
