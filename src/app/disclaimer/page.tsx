import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = { title: '면책조항 | MediAI' };

const TOC = [
  { id: 'service-nature', label: '1. 서비스의 성격' },
  { id: 'ad-law-limit', label: '2. 의료광고법 준수 한계' },
  { id: 'review-board', label: '3. 의료광고 사전심의 안내' },
  { id: 'ai-limit', label: '4. AI 생성 결과의 한계' },
  { id: 'final-responsibility', label: '5. 최종 게시 책임' },
  { id: 'external-api', label: '6. 외부 AI 서비스 의존성' },
  { id: 'contact', label: '7. 문의' },
];

export default function DisclaimerPage() {
  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] font-sans px-4 py-16">
      <div className="max-w-2xl mx-auto">

        {/* 헤더 */}
        <div className="mb-10">
          <Link href="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">← MediAI</Link>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 mt-4">면책조항</h1>
          <p className="text-xs text-slate-400 mt-1">최종 업데이트: 2026년 5월</p>
        </div>

        {/* 주의 배너 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-8">
          <p className="font-extrabold text-red-700 text-sm mb-1">⚠ 의료광고법 관련 안내</p>
          <p className="text-red-600 text-xs leading-relaxed">
            MediAI가 생성하는 모든 콘텐츠는 <strong>의료기관 마케팅 작성 보조 도구</strong>의 결과물이며,
            실제 게시 전 의료법·의료광고법에 따른 최종 검토 및 필요 시 의료광고심의위원회 사전심의를 받을 책임은
            전적으로 콘텐츠를 게시하는 의료기관 본인에게 있습니다.
          </p>
        </div>

        {/* 목차 */}
        <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">목차</p>
          <ol className="space-y-2">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 본문 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-10 text-sm text-slate-700 leading-relaxed">

          <section id="service-nature" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">1. 서비스의 성격</h2>
            <p>
              MediAI는 의료기관의 온라인 마케팅 콘텐츠(리뷰 답변, SNS 게시물, FAQ 등) 작성을
              인공지능으로 보조하는 <strong>마케팅 보조 도구</strong>입니다.
              서비스가 생성한 결과물은 작성 초안으로 제공되며, 환자 진료·진단·치료를 대체하거나 권유하는 것이 아닙니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>본 서비스는 의료행위나 의학적 자문을 제공하지 않습니다.</li>
              <li>생성된 콘텐츠는 마케팅 보조 자료이며, 게시 여부와 수정 책임은 의료기관에 있습니다.</li>
              <li>본 서비스의 결과를 환자에게 직접 의료 정보로 제공해서는 안 됩니다.</li>
            </ul>
          </section>

          <section id="ad-law-limit" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">2. 의료광고법 준수 한계</h2>
            <p>
              MediAI는 의료법 제56조 및 관련 고시에 따른 금지 표현(치료효과 보장, 비교광고, 환자 유인 등)을
              자동으로 회피하도록 프롬프트가 설계되어 있습니다. 다만 다음 한계가 있습니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>AI 특성상 금지 표현이 우회·변형되어 출력될 가능성을 완전히 배제할 수 없습니다.</li>
              <li>최신 의료광고 가이드라인이나 보건복지부 행정해석을 즉시 반영하지 못할 수 있습니다.</li>
              <li>진료과목·시술 종류별 세부 규제(치과, 성형외과 등)는 사용자가 직접 추가 확인해야 합니다.</li>
            </ul>
          </section>

          <section id="review-board" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">3. 의료광고 사전심의 안내</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-3">
              <p className="text-amber-800 text-xs font-bold">의료법상 사전심의 대상 광고는 별도로 심의를 받아야 합니다.</p>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600">
              <li>일정 규모 이상의 매체에 게재되는 의료광고는 의료광고심의위원회의 사전심의를 받아야 합니다(의료법 제57조).</li>
              <li>MediAI는 사전심의를 대행하거나 심의 통과를 보장하지 않습니다.</li>
              <li>심의 대상 여부는 의료기관 또는 소속 협회(대한의사협회·대한치과의사협회 등)에 직접 확인하시기 바랍니다.</li>
            </ul>
          </section>

          <section id="ai-limit" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">4. AI 생성 결과의 한계</h2>
            <p>
              본 서비스는 Google Gemini 등 대형언어모델(LLM)을 활용합니다. AI 특성상 다음 한계가 존재합니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>동일한 입력에 대해서도 매번 결과가 달라질 수 있습니다.</li>
              <li>사실 관계 오류(병원명·시술명·통계 등)가 포함될 수 있습니다.</li>
              <li>최신 의학 정보나 진료 가이드라인을 정확히 반영하지 못할 수 있습니다.</li>
              <li>특정 환자의 리뷰에 대한 답변이 부적절하게 일반화될 수 있습니다.</li>
            </ul>
          </section>

          <section id="final-responsibility" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">5. 최종 게시 책임</h2>
            <p>
              MediAI가 생성한 콘텐츠를 네이버 지도, 카카오 지도, 인스타그램, 블로그, 카카오채널 등에
              게시함으로써 발생하는 법적·행정적 책임(의료법 위반에 따른 행정처분, 명예훼손, 개인정보 노출 등)은
              <strong> 게시 주체인 의료기관에 귀속</strong>됩니다.
              회사는 게시된 콘텐츠로 인해 발생한 손해에 대하여 어떠한 책임도 지지 않습니다.
            </p>
          </section>

          <section id="external-api" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">6. 외부 AI 서비스 의존성</h2>
            <p>
              MediAI는 Google LLC의 Gemini API를 활용하여 콘텐츠를 생성합니다.
              해당 외부 서비스의 장애·정책 변경·요금 정책 변경 등으로 서비스가 일시 중단되거나
              결과 품질이 변동될 수 있으며, 회사는 이에 대해 합리적 노력 외 별도의 보장을 하지 않습니다.
            </p>
          </section>

          <section id="contact" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">7. 문의</h2>
            <div className="bg-slate-50 rounded-xl px-5 py-4 text-xs text-slate-600 space-y-1">
              <p>면책조항 관련 문의는 아래로 연락해 주시기 바랍니다.</p>
              <p className="mt-2"><span className="font-bold text-slate-700">이메일:</span> mukkeby99@gmail.com</p>
            </div>
          </section>

        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          <Link href="/terms" className="hover:text-indigo-600">이용약관</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-indigo-600">개인정보처리방침</Link>
          {' · '}
          <Link href="/" className="hover:text-indigo-600">홈으로</Link>
        </p>

      </div>
    </main>
    <Footer />
    </>
  );
}
