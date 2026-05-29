'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface UsageLog {
  id: string;
  feature: string;
  hospital_type: string | null;
  content_type: string | null;
  input_preview: string | null;
  created_at: string;
}

export interface DailyPoint {
  date: string;          // 'MM/DD'
  review_reply: number;
  content_generator: number;
  faq_generator: number;
  ad_law_check: number;
  total: number;
}

export interface SpecialtyPoint {
  name: string;
  value: number;
}

export interface UsageStats {
  todayCount: number;
  weekTotal: number;
  previousWeekTotal: number;
  recentLogs: UsageLog[];
  dailySeries: DailyPoint[];           // 최근 7일
  specialtyBreakdown: SpecialtyPoint[]; // 최근 30일 진료과별 (top 5 + 기타)
  loading: boolean;
}

const FEATURE_LABELS: Record<string, string> = {
  review_reply: '리뷰 답변',
  content_generator: '콘텐츠 생성',
  faq_generator: 'FAQ 생성',
  ad_law_check: '의료광고법 검사',
};

function formatMonthDay(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildDailySeries(logs: Pick<UsageLog, 'feature' | 'created_at'>[], days: number): DailyPoint[] {
  const series: DailyPoint[] = [];
  const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const todayKST = new Date(nowKST);
  todayKST.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const dayKST = new Date(todayKST);
    dayKST.setDate(dayKST.getDate() - i);
    series.push({
      date: formatMonthDay(dayKST),
      review_reply: 0,
      content_generator: 0,
      faq_generator: 0,
      ad_law_check: 0,
      total: 0,
    });
  }

  for (const log of logs) {
    const createdKST = new Date(new Date(log.created_at).getTime() + 9 * 60 * 60 * 1000);
    const dayKST = new Date(createdKST);
    dayKST.setHours(0, 0, 0, 0);
    const label = formatMonthDay(dayKST);
    const point = series.find(p => p.date === label);
    if (point && log.feature in point) {
      // @ts-expect-error indexing dynamic feature key
      point[log.feature] = (point[log.feature] as number) + 1;
      point.total += 1;
    }
  }

  return series;
}

function buildSpecialtyBreakdown(logs: Pick<UsageLog, 'hospital_type'>[]): SpecialtyPoint[] {
  const counts: Record<string, number> = {};
  for (const log of logs) {
    const key = log.hospital_type?.trim() || '미지정';
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5).map(([name, value]) => ({ name, value }));
  const restTotal = sorted.slice(5).reduce((sum, [, v]) => sum + v, 0);
  if (restTotal > 0) top.push({ name: '기타', value: restTotal });
  return top;
}

export function useUsage(): UsageStats {
  const [stats, setStats] = useState<Omit<UsageStats, 'loading'>>({
    todayCount: 0,
    weekTotal: 0,
    previousWeekTotal: 0,
    recentLogs: [],
    dailySeries: [],
    specialtyBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsage() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) { setLoading(false); return; }

      // KST 자정 기준 시간 계산
      const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000);
      const todayStartKST = new Date(nowKST);
      todayStartKST.setHours(0, 0, 0, 0);

      const todayStartUTC = new Date(todayStartKST.getTime() - 9 * 60 * 60 * 1000);
      const weekStartUTC  = new Date(todayStartUTC.getTime() - 6  * 24 * 60 * 60 * 1000);
      const prevWeekStartUTC = new Date(todayStartUTC.getTime() - 13 * 24 * 60 * 60 * 1000);
      const monthStartUTC = new Date(todayStartUTC.getTime() - 29 * 24 * 60 * 60 * 1000);

      // 최근 30일 로그 한 번에 조회 → 클라이언트에서 집계
      const [logsResult, recentResult] = await Promise.all([
        supabase
          .from('generation_logs')
          .select('feature, hospital_type, created_at')
          .eq('user_id', session.user.id)
          .gte('created_at', prevWeekStartUTC.toISOString())
          .order('created_at', { ascending: true }),
        supabase
          .from('generation_logs')
          .select('id, feature, hospital_type, content_type, input_preview, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      // 진료과 분포는 30일치가 필요하므로 별도 조회
      const monthLogsResult = await supabase
        .from('generation_logs')
        .select('hospital_type')
        .eq('user_id', session.user.id)
        .gte('created_at', monthStartUTC.toISOString());

      if (cancelled) return;

      const allLogs = logsResult.data ?? [];

      const todayCount = allLogs.filter(l => new Date(l.created_at) >= todayStartUTC).length;
      const weekTotal  = allLogs.filter(l => new Date(l.created_at) >= weekStartUTC).length;
      const previousWeekTotal = allLogs.filter(l => {
        const t = new Date(l.created_at);
        return t >= prevWeekStartUTC && t < weekStartUTC;
      }).length;

      setStats({
        todayCount,
        weekTotal,
        previousWeekTotal,
        recentLogs: recentResult.data ?? [],
        dailySeries: buildDailySeries(allLogs, 7),
        specialtyBreakdown: buildSpecialtyBreakdown(monthLogsResult.data ?? []),
      });
      setLoading(false);
    }

    fetchUsage();
    return () => { cancelled = true; };
  }, []);

  return { ...stats, loading };
}

export { FEATURE_LABELS };
