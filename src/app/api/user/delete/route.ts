import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { defaultLimiter, getIp, rateLimitResponse } from '@/lib/rateLimit';

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

  // 프로필 먼저 삭제
  await supabaseAdmin.from('profiles').delete().eq('id', user.id);

  // Auth 유저 삭제
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
