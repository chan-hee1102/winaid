'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import { useUsage, FEATURE_LABELS } from '@/hooks/useUsage';

const TOOLS = [
  { href: '/tools/review-reply',     icon: '⭐', title: '리뷰 답변',       desc: '환자 리뷰 답변' },
  { href: '/tools/content-generator', icon: '📣', title: '콘텐츠 생성',     desc: 'SNS·블로그 문구' },
  { href: '/tools/faq-generator',    icon: '💬', title: 'FAQ 생성',         desc: '환자 FAQ 답변' },
  { href: '/tools/ad-law-checker',   icon: '⚖️', title: '의료광고법 검사', desc: '광고 위반 사전 점검' },
];

const TIER_LIMITS: Record<string, number> = {
  free: 9999, trial: 20, pro: 50, pro_annual: 50, max: 9999, expired: 0,
};

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  free:       { label: '무료',       color: 'text-slate-600 bg-slate-100' },
  trial:      { label: '무료 체험',   color: 'text-indigo-600 bg-indigo-50' },
  pro:        { label: 'Standard',   color: 'text-violet-600 bg-violet-50' },
  pro_annual: { label: 'Premium',    color: 'text-amber-600 bg-amber-50' },
  max:        { label: 'Premium',    color: 'text-amber-600 bg-amber-50' },
  expired:    { label: '만료됨',     color: 'text-red-600 bg-red-50' },
};

const FEATURE_COLORS: Record<string, string> = {
  review_reply:      '#6366f1',
  content_generator: '#8b5cf6',
  faq_generator:     '#ec4899',
  ad_law_check:      '#f59e0b',
};

const SPECIALTY_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#94a3b8'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, isLoggedIn, status: subscription } = useSubscription();
  const {
    todayCount, weekTotal, previousWeekTotal,
    recentLogs, dailySeries, specialtyBreakdown,
    loading: usageLoading,
  } = useUsage();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace('/login');
  }, [isLoading, isLoggedIn, router]);

  const tierInfo = TIER_LABELS[subscription ?? 'free'] ?? TIER_LABELS.free;
  const dailyLimit = TIER_LIMITS[subscription ?? 'free'] ?? 5;
  const isUnlimited = dailyLimit >= 9999;
  const usagePct = isUnlimited ? 0 : Math.min((todayCount / dailyLimit) * 100, 100);
  const usageBarColor = usagePct >= 100 ? 'bg-red-500' : usagePct >= 80 ? 'bg-amber-500' : 'bg-indigo-500';

  const weekDelta = previousWeekTotal === 0
    ? (weekTotal > 0 ? 100 : 0)
    : Math.round(((weekTotal - previousWeekTotal) / previousWeekTotal) * 100);
  const activeSpecialties = specialtyBreakdown.length;

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
          <div className="grid md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">대시보드</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">AI 사용 현황과 진료과별 트렌드를 한눈에 확인하세요.</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${tierInfo.color}`}>
          {tierInfo.label} 플랜
        </span>
      </div>

      {/* 4-stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="오늘 사용량" value={todayCount} loading={usageLoading}>
          {!isUnlimited ? (
            <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${usageBarColor} transition-all`} style={{ width: `${usagePct}%` }} />
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-amber-600 font-bold">무제한</p>
          )}
        </StatCard>

        <StatCard label="이번 주 (7일)" value={weekTotal} loading={usageLoading}>
          <p className="mt-2 text-[11px] text-slate-400">합계 {weekTotal}건</p>
        </StatCard>

        <StatCard label="지난 주 대비" value={`${weekDelta >= 0 ? '+' : ''}${weekDelta}%`} loading={usageLoading}>
          <p className={`mt-2 text-[11px] font-bold ${weekDelta > 0 ? 'text-emerald-600' : weekDelta < 0 ? 'text-red-500' : 'text-slate-400'}`}>
            {weekDelta > 0 ? '↑' : weekDelta < 0 ? '↓' : '–'} 전주 {previousWeekTotal}건
          </p>
        </StatCard>

        <StatCard label="활성 진료과" value={activeSpecialties} loading={usageLoading}>
          <p className="mt-2 text-[11px] text-slate-400">최근 30일</p>
        </StatCard>
      </div>

      {/* AI 도구 바로가기 (4 cols) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold text-slate-500 mb-3">AI 도구 바로가기</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOOLS.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
            >
              <span className="text-2xl mb-1.5">{t.icon}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors leading-tight">{t.title}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 차트: 7일 추이 + 진료과 분포 */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* 7일 사용 추이 */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">최근 7일 도구별 사용량</p>
            <p className="text-[11px] text-slate-400">기준: KST 자정</p>
          </div>
          {usageLoading ? (
            <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          ) : weekTotal === 0 ? (
            <EmptyChart>최근 7일간 사용 이력이 없습니다.</EmptyChart>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySeries} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
                    contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}
                    formatter={(value: number, name: string) => [value, FEATURE_LABELS[name] || name]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(value: string) => FEATURE_LABELS[value] || value}
                  />
                  <Bar dataKey="review_reply"      stackId="a" fill={FEATURE_COLORS.review_reply}      radius={[0, 0, 0, 0]} />
                  <Bar dataKey="content_generator" stackId="a" fill={FEATURE_COLORS.content_generator} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="faq_generator"     stackId="a" fill={FEATURE_COLORS.faq_generator}     radius={[0, 0, 0, 0]} />
                  <Bar dataKey="ad_law_check"      stackId="a" fill={FEATURE_COLORS.ad_law_check}      radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 진료과 분포 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">진료과 분포</p>
            <p className="text-[11px] text-slate-400">최근 30일</p>
          </div>
          {usageLoading ? (
            <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          ) : specialtyBreakdown.length === 0 ? (
            <EmptyChart>아직 진료과 데이터가 없습니다.</EmptyChart>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specialtyBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {specialtyBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={SPECIALTY_COLORS[idx % SPECIALTY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`${value}건`, '사용량']}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: 11, lineHeight: '18px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* 생성 이력 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
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
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    color: FEATURE_COLORS[log.feature] ?? '#6366f1',
                    backgroundColor: `${FEATURE_COLORS[log.feature] ?? '#6366f1'}15`,
                  }}
                >
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

      {subscription === 'free' && (
        <div className="mt-6 text-center">
          <Link href="/pricing" className="inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700">
            업그레이드로 더 많이 사용하기 →
          </Link>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label, value, loading, children,
}: { label: string; value: string | number; loading: boolean; children?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      {loading ? (
        <div className="mt-1 h-7 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      ) : (
        <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      )}
      {children}
    </div>
  );
}

function EmptyChart({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-56 flex items-center justify-center">
      <p className="text-xs text-slate-400 text-center">{children}</p>
    </div>
  );
}
