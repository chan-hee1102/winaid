'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setVisible(true);
      return;
    }
    // 이미 거부한 경우 GA4 비활성화 유지
    if (saved === 'declined') {
      updateGtag('denied');
    }
  }, []);

  const updateGtag = (status: 'granted' | 'denied') => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: status });
    }
  };

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    updateGtag('granted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    updateGtag('denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-4 py-4 shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300 leading-relaxed">
          이 사이트는 방문자 통계 수집을 위해 쿠키를 사용합니다.{' '}
          <Link href="/privacy" className="underline text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap">
            개인정보처리방침
          </Link>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            거부
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
}
