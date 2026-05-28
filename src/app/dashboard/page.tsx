'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import { useUsage, FEATURE_LABELS } from '@/hooks/useUsage';

const TOOLS = [
  { href: '/tools/review-reply', icon: '⭐', title: 'AI 리뷰 답변', desc: '환자 리뷰에 전문 답변 생성' },
  { href: '/tools/content-generator', icon: '📣', title: 'AI 콘텐츠 생성', desc: 'SNS·블로그 마케팅 문구' },
  { href: '/tools/faq-generator', icon: '💬', title: 'AI FAQ 생성', desc: '환자 FAQ 자동 작성' },
];

const TIER_LIMITS: Record<string, number> = {
  free: 5, trial: 20, pro: 50, pro_annual: 50, max: 9999, expired: 0,
};

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: '무료', color: 'text-slate-600 bg-slate-100' },
  trial: { label: '무료 체험', color: 'text-indigo-600 bg-indigo-50' },
  pro: { label: 'Standard', color: 'text-violet-600 bg-violet-50' },
  pro_annual: { label: 'Premium', color: 'text-amber-600 bg-amber-50' },
  max: { label: 'Premium', color: 'text-amber-600 bg-amber-50' },
  expired: { label: '만료됨', color: 'text-red-600 bg-red-50' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isLoggedIn, status: subscription } = useSubscription();
  const { todayCount, recentLogs, loading: usageLoading } = useUsage();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace('/login');
  }, [isLoading, isLoggedIn, router]);

  const tierInfo = TIER_LABELS[subscription ?? 'free'] ?? TIER_LABELS.free;
  const dailyLimit = TIER_LIMITS[subscription ?? 'free'] ?? 5;
  const isUnlimited = dailyLimit >= 9999;
  const pct = isUnlimited ? 0 : Math.min((todayCount / dailyLimit) * 100, 100);
  const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-indigo-500';

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
          <div className="grid md:grid-cols-3 gap-4">
            {[0, 1, 2].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">대시보드</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">오늘의 AI 사용 현황과 생성 이력을 확인하세요.</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${tierInfo.color}`}>
          {tierInfo.label} 플랜
        </span>
      </div>

      {/* 오늘 사용량 카드 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:col-span-1">
          <p className="text-xs font-bold text-slate-500 mb-2">오늘 사용량</p>
          {usageLoading ? (
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ) : (
            <>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{todayCount}</span>
                <span className="text-slate-400 text-sm">/ {isUnlimited ? '∞' : dailyLimit}회</span>
              </div>
              {!isUnlimited && (
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              )}
              {isUnlimited && <p className="text-xs text-amber-600 font-bold">무제한 사용 중</p>}
              {subscription === 'free' && dailyLimit - todayCount <= 1 && (
                <Link href="/pricing" className="mt-3 block text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  업그레이드로 더 많이 사용 →
                </Link>
              )}
            </>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:col-span-2">
          <p className="text-xs font-bold text-slate-500 mb-3">AI 도구 바로가기</p>
          <div className="grid grid-cols-3 gap-3">
            {TOOLS.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex flex-col items-center text-center p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
              >
                <span className="text-2xl mb-1">{t.icon}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors leading-tight">{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 생성 이력 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4">최근 생성 이력</h2>

        {usageLoading && (
          <div className="space-y-3 animate-pulse">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded flex-1" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" />
              </div>
            ))}
          </div>
        )}

        {!usageLoading && recentLogs.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">아직 생성 이력이 없습니다. AI 도구를 사용해보세요!</p>
        )}

        {!usageLoading && recentLogs.length > 0 && (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {FEATURE_LABELS[log.feature] || log.feature}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate">
                  {log.input_preview || log.hospital_type || '-'}
                </span>
                <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
