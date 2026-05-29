'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_TOOLS = [
  { href: '/tools/review-reply', label: '리뷰 답변' },
  { href: '/tools/content-generator', label: '콘텐츠 생성' },
  { href: '/tools/faq-generator', label: 'FAQ 생성' },
  { href: '/tools/ad-law-checker', label: '의료광고법 검사' },
];

export default function Navbar() {
  const router = useRouter();
  const { isLoading, isLoggedIn, isFree, isTrial } = useSubscription();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.replace('/login');
  };

  const showUpgradeButton = isLoggedIn && (isFree || isTrial);

  return (
    <nav className="sticky top-0 z-30 bg-slate-900 dark:bg-gray-950 border-b border-slate-800 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* 로고 */}
        <Link href="/" className="text-base font-extrabold tracking-tighter text-white shrink-0">
          Medi<span className="text-indigo-400">AI</span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className="px-3 h-8 flex items-center rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                대시보드
              </Link>
              {NAV_TOOLS.map(t => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="px-3 h-8 flex items-center rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </>
          )}
          <ThemeToggle />

          {!isLoading && (
            <>
              {!isLoggedIn && (
                <>
                  <Link href="/pricing" className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">
                    요금제
                  </Link>
                  <Link href="/login" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition-all border border-slate-700">
                    로그인
                  </Link>
                  <Link href="/signup" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm">
                    무료 시작
                  </Link>
                </>
              )}

              {showUpgradeButton && (
                <Link href="/pricing" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap">
                  업그레이드
                </Link>
              )}

              {isLoggedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition-all border border-slate-700"
                  >
                    내 계정
                    <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
                      <Link href="/mypage" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                        마이페이지
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors border-t border-slate-100 dark:border-gray-700">
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 모바일: ThemeToggle + 햄버거 */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(prev => !prev)} aria-label="메뉴" className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 슬라이드 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 dark:bg-gray-950 px-4 py-3 flex flex-col gap-1">
          {isLoggedIn && (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                대시보드
              </Link>
              {NAV_TOOLS.map(t => (
                <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                  {t.label}
                </Link>
              ))}
              <div className="h-px bg-slate-800 my-1" />
            </>
          )}
          {!isLoading && (
            <>
              {!isLoggedIn && (
                <>
                  <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                    요금제
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                    로그인
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                    무료로 시작하기
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  {showUpgradeButton && (
                    <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                      업그레이드
                    </Link>
                  )}
                  <Link href="/mypage" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                    마이페이지
                  </Link>
                  <button onClick={handleLogout} className="text-left px-3 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                    로그아웃
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
