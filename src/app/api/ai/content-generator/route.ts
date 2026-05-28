import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '@/lib/tier-server';
import { checkAndRecordUsage } from '@/lib/usage-tracker';
import { defaultLimiter, getIp, rateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `당신은 한국 의료기관 전문 SNS/콘텐츠 마케터입니다.
진료과별 특성을 이해하고, 한국 의료광고법을 준수하면서도 환자에게 매력적인 마케팅 콘텐츠를 작성합니다.

[한국 의료광고법 준수 규칙]
1. 치료 효과 보장, 완치 약속 문구 절대 금지 ("확실히 낫습니다", "보장합니다" 등)
2. 타 병원과의 비교 우위 표현 금지 ("국내 최고", "1위" 등 근거 없는 표현)
3. before/after 비교 사진 연상시키는 직접 언급 금지
4. 비급여 가격 직접 표시 금지 (가격 문의 유도는 가능)
5. 의사/의료진 학력·자격 과장 금지

[콘텐츠 유형별 형식]
- instagram: 2~3문장 본문 + 이모지 적절 활용 + 해시태그 5~7개 (끝에 별도 줄에 해시태그)
- naver_blog: SEO 최적화 블로그 제목 5개 목록 (각 제목 20~35자, 번호 없이 한 줄씩)
- kakao_message: 50~80자 단문 메시지, 친근하고 실용적인 톤, CTA 포함

정확히 3가지 변형을 아래 형식으로 출력하세요:
[변형 1]
(내용)
[변형 2]
(내용)
[변형 3]
(내용)

각 변형의 톤을 다르게: 변형1=정보형, 변형2=감성형, 변형3=혜택강조형
마크다운 없이 순수 텍스트로 출력하세요.`;

const CONTENT_TYPE_LABELS: Record<string, string> = {
  instagram: 'Instagram 게시물',
  naver_blog: '네이버 블로그 제목 5개',
  kakao_message: '카카오채널 메시지',
};

export async function POST(request: NextRequest) {
  if (!defaultLimiter(getIp(request))) return rateLimitResponse();

  const authResult = await authenticate(request);
  if ('response' in authResult) return authResult.response;
  const { user } = authResult;

  let body: { specialty?: string; contentType?: string; keyword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const { specialty, contentType = 'instagram', keyword = '' } = body;
  if (!specialty?.trim()) {
    return NextResponse.json({ error: '진료과를 선택해주세요.' }, { status: 400 });
  }

  const usage = await checkAndRecordUsage(user.id, user.status, 'content_generator', {
    hospitalType: specialty,
    contentType,
    inputPreview: `${specialty} ${contentType} ${keyword}`,
  });

  if (!usage.allowed) {
    return NextResponse.json(
      { error: `오늘 사용량(${usage.limit}회)을 모두 사용했습니다. 요금제를 업그레이드하면 더 많이 사용할 수 있습니다.` },
      { status: 429 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const userMessage = `진료과: ${specialty}
콘텐츠 유형: ${CONTENT_TYPE_LABELS[contentType] || contentType}
강조할 키워드/시술: ${keyword || '없음'}

위 조건에 맞는 마케팅 콘텐츠 3가지 변형을 작성해주세요.`;

  try {
    const result = await model.generateContent(userMessage);
    const rawText = result.response.text();

    // [변형 N] 블록 파싱
    const variations: string[] = [];
    const blocks = rawText.split(/\[변형\s*\d+\]/);
    for (const block of blocks) {
      const trimmed = block.trim();
      if (trimmed) variations.push(trimmed);
    }

    if (variations.length < 2) {
      const fallback = rawText.split(/\n\n+/).filter(s => s.trim().length > 20);
      return NextResponse.json({ variations: fallback.slice(0, 3) });
    }

    return NextResponse.json({ variations: variations.slice(0, 3) });
  } catch (err) {
    console.error('Content generator error:', err);
    return NextResponse.json({ error: 'AI 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
