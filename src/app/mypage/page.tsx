'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Profile {
  name: string;
  subscription_status: string;
  trial_ends_at: string | null;
  pro_expires_at: string | null;
}

export default function MyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setEmail(user.email ?? '');
      setIsEmailUser(user.app_metadata?.provider === 'email');

      if (user.created_at) {
        const d = new Date(user.created_at);
        setCreatedAt(`${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`);
      }

      const { data } = await supabase
        .from('profiles')
        .select('name, subscription_status, trial_ends_at, pro_expires_at')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleSendResetEmail = async () => {
    setPwLoading(true);
    setPwError('');
    setPwMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setPwError('메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      setPwMessage('비밀번호 재설정 메일을 발송했습니다. 메일을 확인해주세요.');
    }
    setPwLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/user/delete', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session?.access_token}` },
    });
    if (!res.ok) {
      setDeleteError('탈퇴 처리 중 오류가 발생했습니다.');
      setDeleteLoading(false);
      return;
    }
    await supabase.auth.signOut();
    router.replace('/');
  };

  const now = new Date();

  const isTrialExpired =
    profile?.subscription_status === 'trial' &&
    profile.trial_ends_at !== null &&
    new Date(profile.trial_ends_at) <= now;

  const isProExpired =
    (profile?.subscription_status === 'pro' || profile?.subscription_status === 'pro_annual') &&
    profile.pro_expires_at !== null &&
    new Date(profile.pro_expires_at) <= now;

  const statusLabel = (status: string) => {
    if (status === 'pro') return 'Pro';
    if (status === 'pro_annual') return 'Pro (연간)';
    if (status === 'trial') return '무료 체험';
    if (status === 'expired') return '만료됨';
    return 'Free';
  };

  const trialDaysLeft = (() => {
    if (profile?.subscription_status !== 'trial' || !profile.trial_ends_at) return null;
    const diff = new Date(profile.trial_ends_at).getTime() - now.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 font-sans px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors text-sm font-medium">
            ← 홈
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-gray-100">내 계정</h1>
        </div>

        {/* 계정 정보 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-6 mb-4">
          <h2 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-4">계정 정보</h2>
          <div className="space-y-1">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-gray-700">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">이름</span>
              <span className="text-sm text-slate-900 dark:text-gray-100 font-semibold">{profile?.name ?? '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-gray-700">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">이메일</span>
              <span className="text-sm text-slate-900 dark:text-gray-100 font-semibold">{email}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-gray-700">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">가입일</span>
              <span className="text-sm text-slate-900 dark:text-gray-100 font-semibold">{createdAt || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">플랜</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isTrialExpired || isProExpired
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : profile?.subscription_status === 'trial'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : (profile?.subscription_status === 'pro' || profile?.subscription_status === 'pro_annual')
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {isTrialExpired || isProExpired ? '만료됨' : statusLabel(profile?.subscription_status ?? 'free')}
              </span>
            </div>

            {/* 체험 만료 배너 */}
            {isTrialExpired && (
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">체험 기간이 종료되었습니다.</span>
                  <a href="/subscribe" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap ml-2">구독하기 →</a>
                </div>
              </div>
            )}

            {/* Pro 만료 배너 */}
            {(isProExpired || profile?.subscription_status === 'expired') && (
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">구독이 만료되었습니다.</span>
                  <a href="/subscribe" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap ml-2">갱신하기 →</a>
                </div>
              </div>
            )}

            {/* 체험 진행 중 D-day 배너 */}
            {profile?.subscription_status === 'trial' && !isTrialExpired && trialDaysLeft !== null && trialDaysLeft > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">무료 체험 종료까지</span>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">D-{trialDaysLeft}</span>
                </div>
              </div>
            )}

            {/* Pro 활성 — 구독 관리 링크 */}
            {(profile?.subscription_status === 'pro' || profile?.subscription_status === 'pro_annual') && !isProExpired && (
              <div className="pt-2">
                <a
                  href="/subscribe"
                  className="flex items-center justify-between px-3 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">구독 관리 (취소 · 갱신)</span>
                  <span className="text-xs text-indigo-500">→</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 비밀번호 변경 — 이메일 로그인 유저만 표시 */}
        {isEmailUser && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-6 mb-4">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2">비밀번호 변경</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-4 leading-relaxed">
              가입한 이메일로 비밀번호 재설정 링크를 보내드립니다.
            </p>
            {pwError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                {pwError}
              </div>
            )}
            {pwMessage && (
              <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-medium">
                {pwMessage}
              </div>
            )}
            <button
              onClick={handleSendResetEmail}
              disabled={pwLoading || !!pwMessage}
              className="w-full py-3 bg-slate-900 dark:bg-gray-700 text-white text-sm font-bold rounded-xl hover:bg-black dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwLoading ? '발송 중...' : '재설정 메일 발송'}
            </button>
          </div>
        )}

        {/* 회원 탈퇴 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/40 shadow-sm p-6">
          <h2 className="text-[10px] font-black text-red-400 uppercase tracking-[0.15em] mb-3">회원 탈퇴</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-4 leading-relaxed">
            탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          {deleteError && (
            <div className="mb-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {deleteError}
            </div>
          )}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 border border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
            >
              회원 탈퇴
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-600 font-semibold text-center mb-3">정말로 탈퇴하시겠습니까?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? '처리 중...' : '탈퇴 확인'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
