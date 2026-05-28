/**
 * IP 기반 메모리 캐시 Rate Limiter
 * - 외부 패키지 없이 순수 Map으로 구현
 * - 서버리스(Serverless) 환경에서는 인스턴스별 독립 동작 (단일 서버에서 정상 작동)
 */

import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

function createLimiter(windowMs: number, max: number) {
  const store = new Map<string, RateLimitEntry>();

  // 만료된 항목 주기적 정리 (메모리 누수 방지)
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, windowMs);

  return function check(ip: string): boolean {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || entry.resetAt <= now) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= max) {
      return false;
    }

    entry.count++;
    return true;
  };
}

// 일반 API: IP당 분당 60회
export const defaultLimiter = createLimiter(60_000, 60);

// 문의하기: IP당 시간당 5회 (스팸 방지)
export const contactLimiter = createLimiter(3_600_000, 5);

/** NextRequest 또는 일반 Request에서 클라이언트 IP 추출 */
export function getIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/** 429 Too Many Requests 응답 */
export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
    { status: 429 },
  );
}
