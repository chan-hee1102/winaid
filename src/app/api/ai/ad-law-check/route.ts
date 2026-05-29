import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '@/lib/tier-server';
import { checkAndRecordUsage } from '@/lib/usage-tracker';
import { defaultLimiter, getIp, rateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `당신은 한국 의료법 및 의료광고 사전심의 규정에 정통한 법무 검토 전문가입니다.
이용자가 입력한 의료기관 광고 문구를 의료법 제56조 및 보건복지부 의료광고 가이드라인에 따라 검토하고,
위반 가능성이 있는 표현을 모두 찾아 구조화된 JSON으로 반환합니다.

[검토 기준 — 위반 카테고리]
- EFFECT_GUARANTEE: 치료효과 보장, 완치 약속 ("100% 완치", "확실히 낫는다", "재발 없음")
- EXAGGERATION: 과장·확언 표현 ("최고", "최상", "가장 안전한", "유일한")
- COMPARATIVE_AD: 타 의료기관과의 비교 우위 ("국내 1위", "업계 최저가")
- PATIENT_INDUCEMENT: 환자 유인 행위 (할인, 사은품, 페이백, 무료 시술권)
- PRICE_DISPLAY: 비급여 가격 직접 표시 (수치 명시)
- BEFORE_AFTER: 시술 전후 직접 비교 묘사
- TESTIMONIAL: 환자 체험기·후기 직접 게재
- PROFESSIONAL_TITLE: 의료진 자격·학력 과장
- SAFETY_OMISSION: 부작용·후유증 정보 누락
- OTHER: 위 어디에도 속하지 않는 기타 위반

[심각도 기준]
- high: 행정처분(업무정지·과징금) 가능성 높은 명백한 위반
- medium: 사전심의 미통과 또는 시정 요구 가능성
- low: 권고 수준, 잠재적 리스크

[종합 판정]
- pass: 위반 0개 또는 low 1개 이하
- warning: medium 1개 이상 또는 low 다수
- fail: high 1개 이상

riskScore는 0(완전 안전)~100(매우 위험) 정수.
rewrite는 위반을 모두 제거한 동일 의도의 안전한 마케팅 문구.
JSON 외 다른 텍스트는 절대 출력하지 마세요.`;

const OUTPUT_FORMAT_INSTRUCTION = `반드시 다음 형식의 JSON 객체로만 응답하세요:
{
  "overall": "pass" | "warning" | "fail",
  "riskScore": 0~100 정수,
  "summary": "한 문장 종합 코멘트",
  "violations": [
    {
      "category": "EFFECT_GUARANTEE" | "EXAGGERATION" | "COMPARATIVE_AD" | "PATIENT_INDUCEMENT" | "PRICE_DISPLAY" | "BEFORE_AFTER" | "TESTIMONIAL" | "PROFESSIONAL_TITLE" | "SAFETY_OMISSION" | "OTHER",
      "severity": "low" | "medium" | "high",
      "snippet": "문제가 된 원문 구절(짧게 발췌)",
      "reason": "의료광고법상 위반 사유",
      "suggestion": "안전한 대체 표현"
    }
  ],
  "rewrite": "전체 문구를 의료광고법에 맞게 수정한 안전한 버전"
}`;

const CHANNEL_LABELS: Record<string, string> = {
  naver_blog: '네이버 블로그',
  instagram: '인스타그램',
  kakao_channel: '카카오채널',
  homepage: '병원 홈페이지',
  leaflet: '전단지·옥외광고',
  other: '기타',
};

export async function POST(request: NextRequest) {
  if (!defaultLimiter(getIp(request))) return rateLimitResponse();

  const authResult = await authenticate(request);
  if ('response' in authResult) return authResult.response;
  const { user } = authResult;

  let body: { adText?: string; channel?: string; hospitalType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const { adText, channel = 'other', hospitalType = '병원' } = body;
  if (!adText?.trim()) {
    return NextResponse.json({ error: '검사할 광고 문구를 입력해주세요.' }, { status: 400 });
  }
  if (adText.length > 4000) {
    return NextResponse.json({ error: '4000자 이내로 입력해주세요.' }, { status: 400 });
  }

  const usage = await checkAndRecordUsage(user.id, user.status, 'ad_law_check', {
    hospitalType,
    contentType: channel,
    inputPreview: adText,
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
    systemInstruction: `${SYSTEM_PROMPT}\n\n${OUTPUT_FORMAT_INSTRUCTION}`,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const userMessage = `[게재 매체] ${CHANNEL_LABELS[channel] || channel}
[병원 유형] ${hospitalType}

[검토 대상 광고 문구]
${adText.trim()}

위 광고 문구를 의료광고법에 따라 검토하고, 지정된 JSON 형식으로만 결과를 반환하세요.`;

  try {
    const result = await model.generateContent(userMessage);
    const rawText = result.response.text();
    const parsed = JSON.parse(rawText);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Ad-law check error:', err);
    return NextResponse.json(
      { error: 'AI 검토 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
