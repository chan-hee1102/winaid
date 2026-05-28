'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Field = 'name' | 'email' | 'password' | 'passwordConfirm' | 'agree';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams.get('error');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [touched, setTouched] = useState<Record<Field, boolean>>({
    name: false, email: false, password: false, passwordConfirm: false, agree: false,
  });
  const [submitError, setSubmitError] = useState(
    initialError === 'oauth' ? '소셜 로그인 중 오류가 발생했습니다.' :
    initialError === 'exchange' ? '인증 처리에 실패했습니다. 다시 시도해주세요.' : ''
  );
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'kakao' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }, [password]);

  const errors = useMemo(() => {
    const e: Partial<Record<Field, string>> = {};
    if (!name.trim()) e.name = '이름을 입력해주세요';
    if (!email) e.email = '이메일을 입력해주세요';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '올바른 이메일 형식이 아닙니다';
    if (!password) e.password = '비밀번호를 입력해주세요';
    else if (password.length < 8) e.password = '비밀번호는 최소 8자 이상이어야 합니다';
    if (!passwordConfirm) e.passwordConfirm = '비밀번호 확인을 입력해주세요';
    else if (password !== passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않습니다';
    if (!agree) e.agree = '약관에 동의해주세요';
    return e;
  }, [name, email, password, passwordConfirm, agree]);

  const isValid = Object.keys(errors).length === 0;
  const showError = (field: Field) => touched[field] && errors[field];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, passwordConfirm: true, agree: true });
    if (!isValid) return;

    setLoading(true);
    setSubmitError('');

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { name: name.trim() },
      },
    });

    if (error) {
      setSubmitError(translateSignupError(error.message));
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'kakao') => {
    setOauthLoading(provider);
    setSubmitError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setSubmitError(error.message);
      setOauthLoading(null);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">메일을 확인해주세요</h2>
            <p className="text-sm text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{email}</span>로
            </p>
            <p className="text-sm text-slate-500 mb-6">
              인증 메일을 보냈습니다. 메일 속 링크를 클릭하면 가입이 완료됩니다.
            </p>
            <p className="text-xs text-slate-400 mb-6">메일이 안 보이면 스팸함을 확인해주세요.</p>
            <Link href="/login" className="block w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors">
              로그인 페이지로
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900">
              Medi<span className="text-indigo-600">AI</span>
            </h1>
          </Link>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            가입 즉시 14일 무료 체험이 시작됩니다
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
          {submitError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FieldWrapper label="이름" error={showError('name') ? errors.name : ''}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                placeholder="홍길동"
                autoComplete="name"
                className={inputClass(!!showError('name'))}
              />
            </FieldWrapper>

            <FieldWrapper label="이메일" error={showError('email') ? errors.email : ''}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                placeholder="email@example.com"
                autoComplete="email"
                inputMode="email"
                className={inputClass(!!showError('email'))}
              />
            </FieldWrapper>

            <FieldWrapper label="비밀번호" error={showError('password') ? errors.password : ''} hint="8자 이상, 영문·숫자·특수문자 조합 권장">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass(!!showError('password'))}
              />
              {password && (
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      i < passwordStrength
                        ? passwordStrength === 1 ? 'bg-red-400'
                        : passwordStrength === 2 ? 'bg-amber-400'
                        : passwordStrength === 3 ? 'bg-lime-400'
                        : 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`} />
                  ))}
                </div>
              )}
            </FieldWrapper>

            <FieldWrapper label="비밀번호 확인" error={showError('passwordConfirm') ? errors.passwordConfirm : ''}>
              <input
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, passwordConfirm: true }))}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass(!!showError('passwordConfirm'))}
              />
            </FieldWrapper>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                onBlur={() => setTouched(t => ({ ...t, agree: true }))}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <Link href="/terms" target="_blank" className="font-bold text-slate-900 hover:text-indigo-600 underline underline-offset-2">이용약관</Link>
                {' 및 '}
                <Link href="/privacy" target="_blank" className="font-bold text-slate-900 hover:text-indigo-600 underline underline-offset-2">개인정보처리방침</Link>
                에 동의합니다 <span className="text-red-500">*</span>
              </span>
            </label>
            {showError('agree') && (
              <p className="text-[11px] text-red-500 font-medium ml-6 -mt-2">{errors.agree}</p>
            )}

            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '가입하기'}
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
              {oauthLoading === 'google' ? <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> : <><GoogleIcon /> Google로 가입</>}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('kakao')}
              disabled={loading || oauthLoading !== null}
              className="w-full py-3 bg-[#FEE500] text-sm font-bold text-[#191919] rounded-xl hover:bg-[#f5dc00] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {oauthLoading === 'kakao' ? <div className="w-4 h-4 border-2 border-[#191919]/30 border-t-[#191919] rounded-full animate-spin" /> : <><KakaoIcon /> 카카오로 가입</>}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">로그인</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function FieldWrapper({ label, error, hint, children }: {
  label: string; error?: string | false; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
        {label} <span className="text-red-500 normal-case tracking-normal">*</span>
      </label>
      {children}
      {error ? <p className="text-[11px] text-red-500 font-medium mt-1">{error}</p>
        : hint ? <p className="text-[11px] text-slate-400 font-medium mt-1">{hint}</p>
        : null}
    </div>
  );
}

function translateSignupError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('database error') || m.includes('saving new user')) return '가입 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
  if (m.includes('already') || m.includes('registered') || m.includes('exists')) return '이미 가입된 이메일이에요. 로그인 페이지로 이동해주세요.';
  if (m.includes('rate') || m.includes('too many')) return '잠시 후 다시 시도해주세요.';
  if (m.includes('weak password') || m.includes('password should')) return '비밀번호가 너무 단순해요. 영문·숫자·특수문자를 섞어 8자 이상으로 입력해주세요.';
  if (m.includes('network') || m.includes('failed to fetch')) return '네트워크 연결을 확인해주세요.';
  return '가입 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
    hasError ? 'border-red-300 focus:ring-red-400 bg-red-50/30' : 'border-slate-200 focus:ring-indigo-500'
  }`;
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

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
