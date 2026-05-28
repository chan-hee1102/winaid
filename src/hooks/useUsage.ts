'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface UsageStats {
  todayCount: number;
  recentLogs: {
    id: string;
    feature: string;
    hospital_type: string | null;
    content_type: string | null;
    input_preview: string | null;
    created_at: string;
  }[];
  loading: boolean;
}

const FEATURE_LABELS: Record<string, string> = {
  review_reply: '리뷰 답변',
  content_generator: '콘텐츠 생성',
  faq_generator: 'FAQ 생성',
};

export function useUsage(): UsageStats {
  const [todayCount, setTodayCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<UsageStats['recentLogs']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsage() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) { setLoading(false); return; }

      // KST 오늘 시작 시각
      const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000);
      const dayStartKST = new Date(nowKST);
      dayStartKST.setHours(0, 0, 0, 0);
      const dayStartUTC = new Date(dayStartKST.getTime() - 9 * 60 * 60 * 1000);

      const [countResult, logsResult] = await Promise.all([
        supabase
          .from('generation_logs')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('created_at', dayStartUTC.toISOString()),
        supabase
          .from('generation_logs')
          .select('id, feature, hospital_type, content_type, input_preview, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      if (cancelled) return;

      setTodayCount(countResult.count ?? 0);
      setRecentLogs(logsResult.data ?? []);
      setLoading(false);
    }

    fetchUsage();
    return () => { cancelled = true; };
  }, []);

  return { todayCount, recentLogs, loading };
}

export { FEATURE_LABELS };
