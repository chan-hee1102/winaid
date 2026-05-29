import { supabaseAdmin } from '@/lib/supabase-admin';
import type { TierStatus } from '@/lib/tier-server';

// TODO: free 한도는 베타 기간 테스트 편의를 위해 9999로 풀어놓음. 정식 출시 전 5로 복원.
const DAILY_LIMITS: Record<TierStatus, number> = {
  free:       9999,
  trial:      20,
  pro:        50,
  pro_annual: 50,
  max:        9999,
  expired:    0,
};

export type UsageFeature = 'review_reply' | 'content_generator' | 'faq_generator' | 'ad_law_check';

export interface UsageResult {
  allowed: boolean;
  limit: number;
  used: number;
}

export async function checkAndRecordUsage(
  userId: string,
  status: TierStatus,
  feature: UsageFeature,
  meta?: { hospitalType?: string; contentType?: string; inputPreview?: string }
): Promise<UsageResult> {
  const limit = DAILY_LIMITS[status] ?? 5;

  if (limit === 0) return { allowed: false, limit: 0, used: 0 };

  // KST 자정 기준 오늘 시작 시각 (UTC)
  const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dayStartKST = new Date(nowKST);
  dayStartKST.setHours(0, 0, 0, 0);
  const dayStartUTC = new Date(dayStartKST.getTime() - 9 * 60 * 60 * 1000);

  const { count } = await supabaseAdmin
    .from('generation_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', dayStartUTC.toISOString());

  const used = count ?? 0;

  if (limit !== 9999 && used >= limit) {
    return { allowed: false, limit, used };
  }

  await supabaseAdmin.from('generation_logs').insert({
    user_id: userId,
    feature,
    hospital_type: meta?.hospitalType ?? null,
    content_type: meta?.contentType ?? null,
    input_preview: meta?.inputPreview ? meta.inputPreview.slice(0, 100) : null,
  });

  return { allowed: true, limit, used: used + 1 };
}
