'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError('링크가 만료되었거나 유효하지 않습니다. 다시 시도해 주세요.');
        } else {
          setSessionReady(true);
        }
        setInitializing(false);
      });
    } else {
      // auth/callback에서 이미 세션이 설정된 경우
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSessionReady(true);
        } else {
          setError('유효하지 않은 접근입니다. 비밀번호 찾기를 다시 시도해 주세요.');
        }
        setInitializing(false);
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
      setLoading(false);
    } else {
      router.replace('/mypage');
    }
  };

  if (initializing) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!sessionReady) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
            <a href="/login" className="block text-sm font-bold text-indigo-600 hover:text-indigo-700">
              로그인으로 돌아가기
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900">
            KOSTOCK <span className="text-indigo-600">Pro</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">새 비밀번호 설정</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="6자 이상"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="비밀번호 재입력"
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
