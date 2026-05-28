import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '@/lib/tier-server';
import { checkAndRecordUsage } from '@/lib/usage-tracker';
import { defaultLimiter, getIp, rateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `당신은 한국 병원의 환자 소통 전문가입니다.
환자들이 궁금해하는 질문에 대해 전문적이면서도 이해하기 쉬운 FAQ 답변을 작성합니다.

[답변 작성 원칙]
1. 의학적으로 정확한 표현을 사용하되, 일반인이 이해할 수 있는 언어 사용
2. 치료 결과 보장이나 확언 금지 ("반드시 낫습니다" 등)
3. 증상에 따라 개인차가 있음을 자연스럽게 언급
4. 진료 예약 및 상담을 자연스럽게 유도
5. 부작용/주의사항도 솔직하고 균형있게 안내 (숨기지 말 것)
6. 각 답변: 3~5문장, 친절하고 안심되는 톤
7. "~합니다" 존댓말 체계 통일

각 질문에 대해 다음 형식으로 출력하세요:
Q: (질문 그대로 적기)
A: (답변)

병원명을 자연스럽게 1~2회 언급해도 됩니다.
마크다운 없이 순수 텍스트로 출력하세요.`;

export async function POST(request: NextRequest) {
  if (!defaultLimiter(getIp(request))) return rateLimitResponse();

  const authResult = await authenticate(request);
  if ('response' in authResult) return authResult.response;
  const { user } = authResult;

  let body: { hospitalName?: string; specialty?: string; questions?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const { hospitalName, specialty, questions } = body;
  if (!questions?.length || questions.length < 1) {
    return NextResponse.json({ error: '질문을 최소 1개 이상 입력해주세요.' }, { status: 400 });
  }

  const usage = await checkAndRecordUsage(user.id, user.status, 'faq_generator', {
    hospitalType: specialty,
    inputPreview: questions[0],
  });

  if (!usage.allowed) {
    return NextResponse.json(
      { error: `오늘 사용량(${usage.limit}회)을 모두 사용했습니다. 요금제를 업그레이드하면 더 많이 사용할 수 있습니다.` },
      { status: 429 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userMessage = `병원명: ${hospitalName || '저희 병원'}
진료과: ${specialty || '일반'}
환자 FAQ 목록:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

위 각 질문에 대한 전문적이고 친절한 FAQ 답변을 작성해주세요.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse Q: A: pairs
    const faqItems: { q: string; a: string }[] = [];
    const lines = rawText.split('\n');
    let currentQ = '';
    let currentA = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Q:')) {
        if (currentQ && currentA) {
          faqItems.push({ q: currentQ.trim(), a: currentA.trim() });
        }
        currentQ = trimmed.slice(2).trim();
        currentA = '';
      } else if (trimmed.startsWith('A:')) {
        currentA = trimmed.slice(2).trim();
      } else if (currentA && trimmed) {
        currentA += ' ' + trimmed;
      }
    }
    if (currentQ && currentA) {
      faqItems.push({ q: currentQ.trim(), a: currentA.trim() });
    }

    return NextResponse.json({ faqItems, rawText });
  } catch (err) {
    console.error('FAQ generator error:', err);
    return NextResponse.json({ error: 'AI 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
