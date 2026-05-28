import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { defaultLimiter, getIp, rateLimitResponse } from '@/lib/rateLimit';

// 만료된 구독을 'free'로 강제 업데이트
// 클라이언트(useSubscription)가 만료를 감지하면 호출
export async function POST(req: NextRequest) {
  if (!defaultLimiter(getIp(req))) return rateLimitResponse();

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('subscription_status, trial_ends_at, pro_expires_at')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const now = new Date();
  const status = profile.subscription_status as string;

  const isTrialExpired =
    status === 'trial' &&
    profile.trial_ends_at !== null &&
    new Date(profile.trial_ends_at) <= now;

  const isProExpired =
    (status === 'pro' || status === 'pro_annual') &&
    profile.pro_expires_at !== null &&
    new Date(profile.pro_expires_at) <= now;

  if (!isTrialExpired && !isProExpired) {
    // 만료 아님 — 업데이트 불필요
    return NextResponse.json({ updated: false, status });
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ subscription_status: 'free' })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ updated: true, status: 'free' });
}
