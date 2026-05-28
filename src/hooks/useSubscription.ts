'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SubscriptionStatus = 'free' | 'trial' | 'pro' | 'pro_annual' | 'max' | 'expired';

interface UseSubscriptionResult {
  isLoading: boolean;
  isLoggedIn: boolean;
  isFree: boolean;
  isPro: boolean;
  isMax: boolean;
  isTrial: boolean;
  isAdmin: boolean;
  isTrialExpired: boolean;
  isProExpired: boolean;
  trialDaysLeft: number;
  status: SubscriptionStatus | null;
  userId: string | null;
}

export function useSubscription(): UseSubscriptionResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);
  const [role, setRole] = useState<string>('user');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoggedIn(false);
        setStatus(null);
        setTrialEndsAt(null);
        setProExpiresAt(null);
        setRole('user');
        setUserId(null);
        setIsLoading(false);
        return;
      }
      setIsLoggedIn(true);
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, trial_ends_at, pro_expires_at, role')
        .eq('id', user.id)
        .maybeSingle();

      const rawStatus = (profile?.subscription_status as SubscriptionStatus) ?? 'free';
      setStatus(rawStatus);
      setTrialEndsAt(profile?.trial_ends_at ?? null);
      setProExpiresAt(profile?.pro_expires_at ?? null);
      setRole(profile?.role ?? 'user');

      // 만료 감지 시 DB 자동 업데이트 (fire-and-forget)
      const now = new Date();
      const trialExpired =
        rawStatus === 'trial' &&
        profile?.trial_ends_at != null &&
        new Date(profile.trial_ends_at) <= now;

      const proExpired =
        (rawStatus === 'pro' || rawStatus === 'pro_annual' || rawStatus === 'max') &&
        profile?.pro_expires_at != null &&
        new Date(profile.pro_expires_at) <= now;

      if (trialExpired || proExpired) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          fetch('/api/user/expire-subscription', {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
            .then(res => res.json())
            .then(data => {
              if (data.updated) setStatus('free');
            })
            .catch(() => {
              // 네트워크 오류 시 로컬 상태만이라도 'free'로 처리
              setStatus('free');
            });
        } else {
          setStatus('free');
        }
      }

      setIsLoading(false);
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return;
      if (!session) {
        setIsLoggedIn(false);
        setStatus(null);
        setTrialEndsAt(null);
        setProExpiresAt(null);
        setRole('user');
        setUserId(null);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        check();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = role === 'admin';

  // 판단 순서:
  // a. admin → 전체 접근
  // b. pro/pro_annual + 만료 안됨 → Pro 접근
  // c. trial + trial_ends_at 안됨 → Pro 접근
  // d. 나머지 → 무료 접근
  const now = new Date();

  const isTrialExpired =
    status === 'trial' &&
    trialEndsAt !== null &&
    new Date(trialEndsAt) <= now;

  const isProExpired =
    (status === 'pro' || status === 'pro_annual' || status === 'max') &&
    proExpiresAt !== null &&
    new Date(proExpiresAt) <= now;

  const trialActive =
    status === 'trial' &&
    trialEndsAt !== null &&
    new Date(trialEndsAt) > now;

  const proActive =
    (status === 'pro' || status === 'pro_annual' || status === 'max') &&
    (proExpiresAt === null || new Date(proExpiresAt) > now);

  const maxActive =
    status === 'max' &&
    (proExpiresAt === null || new Date(proExpiresAt) > now);

  const isMax  = isAdmin || maxActive;
  const isPro  = isAdmin || proActive || trialActive;
  const isTrial = trialActive;

  const trialDaysLeft = isTrial
    ? Math.max(0, Math.ceil((new Date(trialEndsAt!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isFree = isLoggedIn && !isPro;

  return {
    isLoading,
    isLoggedIn,
    isFree,
    isPro,
    isMax,
    isTrial,
    isAdmin,
    isTrialExpired,
    isProExpired,
    trialDaysLeft,
    status,
    userId,
  };
}
