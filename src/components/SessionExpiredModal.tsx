'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SessionExpiredModal() {
  const [show, setShow] = useState(false);
  const wasLoggedIn = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) wasLoggedIn.current = true;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        wasLoggedIn.current = true;
        setShow(false);
      } else if (event === 'SIGNED_OUT' && wasLoggedIn.current) {
        wasLoggedIn.current = false;
        // 로그아웃 버튼으로 인한 경우 /login으로 이미 이동하므로
        // 잠시 후 현재 경로가 /login이 아닐 때만 표시
        setTimeout(() => {
          if (!window.location.pathname.startsWith('/login')) {
            setShow(true);
          }
        }, 300);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">세션이 만료되었습니다</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          보안을 위해 일정 시간이 지나면 자동으로 로그아웃됩니다.<br />
          계속 이용하시려면 다시 로그인해 주세요.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
          >
            다시 로그인하기
          </button>
          <button
            onClick={() => setShow(false)}
            className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
