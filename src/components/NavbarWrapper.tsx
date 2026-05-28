'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

// 이 경로들은 자체 네비게이션을 가지거나 인증 플로우라 Navbar 불필요
const EXCLUDED_PATHS = [
  '/pricing',
  '/login',
  '/signup',
  '/onboarding',
  '/forgot-password',
  '/reset-password',
  '/auth',
];

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (EXCLUDED_PATHS.some(p => pathname.startsWith(p))) return null;
  return <Navbar />;
}
