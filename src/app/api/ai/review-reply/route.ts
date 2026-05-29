import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '@/lib/tier-server';
import { checkAndRecordUsage } from '@/lib/usage-tracker';
import { defaultLimiter, getIp, rateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `당신은 한국 병원의 온라인 마케팅 전문가이자 의료 커뮤니케이션 전문가입니다.
당신의 역할은 네이버 지도, 카카오 지도, 구글 지도 등에 달린 환자 리뷰에 대해
병원 공식 입장에서 전문적이고 따뜻한 답변을 작성하는 것입니다.

[답변 작성 원칙]
1. 진료 효과, 완치 보장, 특정 치료 결과를 약속하는 표현 절대 금지
2. "최고", "최상", "100%", "확실히" 같은 과장 또는 확언 표현 금지
3. 개인 의료 정보나 진료 내용 구체적 언급 금지
4. 비급여 가격이나 특정 시술 비용 직접 언급 금지
5. 음식점식 감사 인사("또 방문해주세요" 류의 과도한 친근함) 지양
6. 부정적 리뷰도 방어적이지 않게, 개선 의지와 공감으로 응대
7. 길이: 3~5문장 (너무 짧거나 길면 안 됨)
8. 끝에 서명: "[병원유형] 드림" 형식

[톤 & 매너]
- "안녕하세요"로 시작
- 존댓말 유지, 공식적이되 따뜻함

답변은 한국어로만 작성하고, 마크다운 없이 순수 텍스트로 출력하세요.`;

export async function POST(request: NextRequest) {
  if (!defaultLimiter(getIp(request))) return rateLimitResponse();

  const authResult = await authenticate(request);
  if ('response' in authResult) return authResult.response;
  const { user } = authResult;

  let body: { reviewText?: string; hospitalType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const { reviewText, hospitalType = '병원' } = body;
  if (!reviewText?.trim()) {
    return NextResponse.json({ error: '리뷰 내용을 입력해주세요.' }, { status: 400 });
  }

  const usage = await checkAndRecordUsage(user.id, user.status, 'review_reply', {
    hospitalType,
    inputPreview: reviewText,
  });

  if (!usage.allowed) {
    return NextResponse.json(
      { error: `오늘 사용량(${usage.limit}회)을 모두 사용했습니다. 요금제를 업그레이드하면 더 많이 사용할 수 있습니다.` },
      { status: 429 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const userMessage = `병원 유형: ${hospitalType}
환자 리뷰:
---
${reviewText.trim()}
---
위 리뷰에 대한 전문적이고 따뜻한 병원 공식 답변을 작성해주세요.`;

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userMessage);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify({ error: '생성 중 오류가 발생했습니다.' })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
