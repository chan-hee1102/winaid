import Link from 'next/link';

const FEATURES = [
  {
    icon: '⭐',
    title: 'AI 리뷰 답변 생성기',
    desc: '네이버·카카오·구글 지도 환자 리뷰를 붙여넣으면 Claude AI가 의료광고법 준수 답변을 3초 안에 생성합니다.',
    href: '/tools/review-reply',
  },
  {
    icon: '📣',
    title: 'AI 마케팅 콘텐츠 생성기',
    desc: '진료과와 키워드를 선택하면 Instagram, 네이버 블로그, 카카오채널용 마케팅 문구 3가지 변형을 즉시 제공합니다.',
    href: '/tools/content-generator',
  },
  {
    icon: '💬',
    title: 'AI 환자 FAQ 생성기',
    desc: '자주 묻는 질문 목록을 입력하면 병원 브랜드에 맞는 전문적인 FAQ 답변을 자동으로 완성하고 다운로드할 수 있습니다.',
    href: '/tools/faq-generator',
  },
];

const STATS = [
  { label: '병원·의원 적합', value: '300+', sub: '잠재 고객' },
  { label: 'AI 도구', value: '3가지', sub: '핵심 기능' },
  { label: '무료 체험', value: '14일', sub: '카드 없이' },
  { label: '답변 생성', value: '3초', sub: '이내' },
];

const PLANS = [
  {
    name: '무료',
    price: '₩0',
    period: '영구 무료',
    features: ['하루 5회 AI 생성', '3가지 도구 모두 사용', '기본 지원'],
    cta: '무료로 시작',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Standard',
    price: '₩29,000',
    period: '/ 월',
    features: ['하루 30회 AI 생성', '3가지 도구 모두 사용', '우선 지원', '생성 이력 30일 보관'],
    cta: '14일 무료 체험',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '₩290,000',
    period: '/ 년',
    features: ['무제한 AI 생성', '3가지 도구 모두 사용', '전담 지원', '생성 이력 무제한', '병원 맞춤 프리셋'],
    cta: '연간 플랜 시작',
    href: '/signup',
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080d1a] text-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8">
          Claude AI 기반 · 의료광고법 준수 · 한국어 특화
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          병원 마케팅,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            AI로 10배 빠르게
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          리뷰 답변, SNS 콘텐츠, 환자 FAQ를 AI가 자동으로 작성합니다.
          의료광고법 규정을 내장해 안전하게 사용할 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-500/25"
          >
            14일 무료 체험 시작
          </Link>
          <Link
            href="#pricing"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-8 py-4 rounded-xl text-base transition-all border border-slate-700"
          >
            요금제 보기
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              <div className="text-xs text-indigo-400 font-semibold">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-4">
          병원 마케팅의 모든 반복 업무를 AI로
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
          하루에도 수십 번 반복되는 리뷰 답변, 콘텐츠 작성, FAQ 정리를
          이제 클릭 하나로 해결하세요.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Link
              key={f.href}
              href={f.href}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              <div className="mt-4 text-xs font-bold text-indigo-400">사용해보기 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why MediAI */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/20 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center">왜 MediAI인가?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '의료광고법 내장', desc: 'Claude AI 시스템 프롬프트에 효과 보장·비교 광고 등 금지 항목을 내장해 법적 리스크를 줄입니다.' },
              { title: '한국 의료 도메인 특화', desc: '네이버 지도, 카카오 지도, 한국 환자 커뮤니케이션 스타일에 최적화된 출력을 제공합니다.' },
              { title: '실시간 스트리밍', desc: '생성 결과를 기다리지 않고 실시간으로 텍스트가 완성되는 것을 볼 수 있습니다.' },
              { title: '즉시 복사·다운로드', desc: '생성된 콘텐츠를 원클릭으로 복사하거나 텍스트 파일로 저장할 수 있습니다.' },
            ].map(item => (
              <div key={item.title} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-4">간단한 요금제</h2>
        <p className="text-slate-400 text-center mb-12">카드 정보 없이 14일 무료 체험 가능</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(p => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 border ${p.highlight
                ? 'bg-gradient-to-b from-indigo-900/60 to-violet-900/40 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900 border-slate-800'}`}
            >
              {p.highlight && (
                <div className="text-xs font-bold text-indigo-300 bg-indigo-500/20 rounded-full px-3 py-1 inline-block mb-3">
                  인기
                </div>
              )}
              <div className="font-extrabold text-xl text-white mb-1">{p.name}</div>
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

      {/* CTA */}
      <section className="border-t border-slate-800 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">지금 바로 시작하세요</h2>
        <p className="text-slate-400 mb-8">14일 무료 체험, 카드 정보 불필요</p>
        <Link
          href="/signup"
          className="inline-block bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-500/25"
        >
          무료로 시작하기
        </Link>
      </section>
    </main>
  );
}
