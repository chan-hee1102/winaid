'use client';

import Link from 'next/link';

const PLANS = [
  {
    name: '무료',
    price: '₩0',
    period: '영구 무료',
    features: [
      '하루 5회 AI 생성',
      '리뷰 답변 생성기',
      '콘텐츠 생성기',
      'FAQ 생성기',
    ],
    cta: '무료로 시작',
    href: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Standard',
    price: '₩29,000',
    period: '/ 월',
    features: [
      '하루 30회 AI 생성',
      '리뷰 답변 생성기 (무제한)',
      '콘텐츠 생성기 (무제한)',
      'FAQ 생성기 (무제한)',
      '생성 이력 30일 보관',
      '우선 이메일 지원',
    ],
    cta: '14일 무료 체험 시작',
    href: '/signup',
    highlight: true,
    badge: '인기',
  },
  {
    name: 'Premium',
    price: '₩290,000',
    period: '/ 년',
    features: [
      '무제한 AI 생성',
      '리뷰 답변 생성기 (무제한)',
      '콘텐츠 생성기 (무제한)',
      'FAQ 생성기 (무제한)',
      '생성 이력 무제한 보관',
      '병원 맞춤 프리셋',
      '전담 지원',
    ],
    cta: '연간 플랜 시작',
    href: '/signup',
    highlight: false,
    badge: '2개월 무료',
  },
];

const FAQS = [
  {
    q: '무료 체험은 어떻게 시작하나요?',
    a: '회원가입 즉시 14일 무료 체험이 시작됩니다. 카드 정보 없이 모든 기능을 사용해볼 수 있습니다.',
  },
  {
    q: '의료광고법을 어떻게 준수하나요?',
    a: 'Claude AI의 시스템 프롬프트에 한국 의료광고법 금지 항목(효과 보장, 비교 광고, 가격 직접 표시 등)을 내장하여 법적 리스크를 최소화합니다.',
  },
  {
    q: '어떤 병원/의원에 적합한가요?',
    a: '피부과, 치과, 성형외과, 내과, 정형외과, 한의원 등 모든 의료기관에 사용할 수 있습니다. 진료과별 특화 콘텐츠를 지원합니다.',
  },
  {
    q: '생성된 내용을 그대로 사용해도 되나요?',
    a: '생성된 내용은 초안으로 제공됩니다. 실제 병원 상황에 맞게 검토·수정 후 사용하시길 권장합니다.',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#080d1a] text-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">요금제</h1>
        <p className="text-slate-400 text-lg">카드 정보 없이 14일 무료 체험 가능</p>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(p => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 border relative ${p.highlight
                ? 'bg-gradient-to-b from-indigo-900/60 to-violet-900/40 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900 border-slate-800'}`}
            >
              {p.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                  p.highlight ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {p.badge}
                </div>
              )}
              <div className="font-extrabold text-xl text-white mb-1 mt-2">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-white">{p.price}</span>
                <span className="text-slate-400 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-2 my-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`block text-center font-bold py-3 rounded-xl text-sm transition-all ${p.highlight
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-extrabold text-center mb-10">자주 묻는 질문</h2>
        <div className="space-y-4">
          {FAQS.map(faq => (
            <div key={faq.q} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
