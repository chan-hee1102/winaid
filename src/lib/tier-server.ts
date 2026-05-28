// 서버 라우트 전용 — 인증 + 티어 체크 헬퍼
// 클라이언트에서 import 금지 (supabase-admin 사용)
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export type TierStatus = 'free' | 'trial' | 'pro' | 'pro_annual' | 'max' | 'expired';

export interface AuthedUser {
  id     : string;
  email  : string | null;
  status : TierStatus;
  role   : 'user' | 'admin';
  isPro  : boolean;  // pro/pro_annual/max/trial(active) 또는 admin
  isMax  : boolean;  // max 또는 admin
}

/**
 * Authorization: Bearer <access_token> 헤더에서 유저를 꺼내고
 * profiles 테이블의 티어/만료를 검증해 정규화된 객체를 돌려준다.
 *
 * 실패 시 NextResponse 반환 (라우트에서 그대로 return).
 */
export async function authenticate(
  request: Request,
): Promise<{ user: AuthedUser } | { response: Response }> {
  const auth  = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) {
    return { response: NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 }) };
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return { response: NextResponse.json({ error: '인증 실패' }, { status: 401 }) };
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('subscription_status, trial_ends_at, pro_expires_at, role')
    .eq('id', user.id)
    .maybeSingle();

  const rawStatus = (profile?.subscription_status as TierStatus) ?? 'free';
  const role      = (profile?.role as 'user' | 'admin') ?? 'user';
  const now       = new Date();

  const trialActive =
    rawStatus === 'trial' &&
    profile?.trial_ends_at != null &&
    new Date(profile.trial_ends_at) > now;

  const proActive =
    (rawStatus === 'pro' || rawStatus === 'pro_annual' || rawStatus === 'max') &&
    (profile?.pro_expires_at == null || new Date(profile.pro_expires_at) > now);

  const isAdmin = role === 'admin';
  const isMax   = isAdmin || (rawStatus === 'max' && proActive);
  const isPro   = isAdmin || proActive || trialActive;

  return {
    user: {
      id     : user.id,
      email  : user.email ?? null,
      status : rawStatus,
      role,
      isPro,
      isMax,
    },
  };
}

/**
 * MAX 티어 (또는 admin) 만 통과시킨다.
 * Pro / Trial 은 403.
 */
export async function requireMax(
  request: Request,
): Promise<{ user: AuthedUser } | { response: Response }> {
  const result = await authenticate(request);
  if ('response' in result) return result;
  if (!result.user.isMax) {
    return {
      response: NextResponse.json(
        { error: 'MAX 등급만 사용 가능합니다.', tier: result.user.status },
        { status: 403 },
      ),
    };
  }
  return result;
}
