'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-gray-950 text-slate-400 font-sans mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-white text-sm font-extrabold mb-3">
              Medi<span className="text-indigo-400">AI</span>
            </p>
            <p className="text-xs">병원 AI 마케팅 어시스턴트</p>
            <p className="text-xs">AI 기반 · 의료광고법 준수</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end sm:justify-start">
            <Link href="/terms" className="text-xs hover:text-white transition-colors">이용약관</Link>
            <Link href="/privacy" className="text-xs hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/pricing" className="text-xs hover:text-white transition-colors">요금제</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-[11px] text-slate-500">© 2026 MediAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
