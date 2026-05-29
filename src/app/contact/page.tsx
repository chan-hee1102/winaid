'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const TYPES = ['버그 신고', '기능 제안', '결제 문의', '기타'] as const;
type ContactType = typeof TYPES[number];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<ContactType>('기타');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, type, message }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? '오류가 발생했습니다. 다시 시도해주세요.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-10">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-gray-100 mb-2">문의가 접수되었습니다</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
              빠른 시일 내에 <strong>{email}</strong>로<br />답변 드리겠습니다.
            </p>
            <Link
              href="/"
              className="block w-full py-3 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors text-center"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 font-sans px-4 py-16">
      <div className="w-full max-w-lg mx-auto">

        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            ← MediAI
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-gray-100 mt-4">문의하기</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">궁금한 점이나 불편한 사항을 알려주세요.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-gray-100 placeholder-slate-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="홍길동"
                required
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                이메일 <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-gray-100 placeholder-slate-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="email@example.com"
                required
              />
            </div>

            {/* 문의 유형 */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
                문의 유형 <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      type === t
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 문의 내용 */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                문의 내용 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-gray-100 placeholder-slate-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="문의 내용을 자세히 작성해주세요."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '전송 중...' : '문의 보내기'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          또는 직접 이메일로 문의하세요:{' '}
          <a href="mailto:mukkeby99@gmail.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
            mukkeby99@gmail.com
          </a>
        </p>
      </div>
    </main>
    <Footer />
    </>
  );
}
