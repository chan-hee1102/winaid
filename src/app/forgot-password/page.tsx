'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError('메일 발송에 실패했습니다. 이메일 주소를 확인해 주세요.');
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-500 text-2xl">✓</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">메일을 확인하세요</h2>
            <p className="text-sm text-slate-500 mb-6">
              <span className="font-semibold text-slate-700">{email}</span>로<br />
              비밀번호 재설정 링크를 보냈습니다.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors text-center"
            >
              로그인으로 돌아가기
            </Link>
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
            Medi<span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">비밀번호 찾기</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="email@example.com"
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? '발송 중...' : '재설정 메일 발송'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
