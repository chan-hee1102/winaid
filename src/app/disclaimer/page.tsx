import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = { title: '면책조항 | KOSTOCK Pro' };

const TOC = [
  { id: 'investment-info', label: '1. 투자 정보의 성격' },
  { id: 'accuracy', label: '2. 정확성 보장 안 함' },
  { id: 'investment-loss', label: '3. 투자 손실 책임 없음' },
  { id: 'data-delay', label: '4. 데이터 지연·오류 책임 한계' },
  { id: 'ai-analysis', label: '5. AI 분석 결과의 한계' },
  { id: 'external-links', label: '6. 외부 정보 출처' },
  { id: 'contact', label: '7. 문의' },
];

export default function DisclaimerPage() {
  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] font-sans px-4 py-16">
      <div className="max-w-2xl mx-auto">

        {/* 헤더 */}
        <div className="mb-10">
          <Link href="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">← KOSTOCK Pro</Link>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 mt-4">면책조항</h1>
          <p className="text-xs text-slate-400 mt-1">최종 업데이트: 2026년 3월</p>
        </div>

        {/* 주의 배너 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-8">
          <p className="font-extrabold text-red-700 text-sm mb-1">⚠ 투자 유의사항</p>
          <p className="text-red-600 text-xs leading-relaxed">
            KOSTOCK Pro가 제공하는 모든 정보는 <strong>투자 참고용</strong>이며 특정 종목의 매수·매도를 권유하지 않습니다.
            투자 결정 및 그 결과에 대한 책임은 전적으로 이용자 본인에게 있습니다.
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

          <section id="investment-info" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">1. 투자 정보의 성격</h2>
            <p>
              본 서비스는 자본시장과 금융투자업에 관한 법률 제101조에 따른 <strong>유사투자자문업자</strong>로 신고된 서비스입니다.
              서비스가 제공하는 테마 분석, 종목 정보, 글로벌 증시 동향 등 모든 콘텐츠는 투자 참고 목적으로만 제공됩니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>특정 종목의 매수·매도·보유를 권유하거나 추천하지 않습니다.</li>
              <li>개별 이용자의 재무 상황, 투자 목적, 위험 성향을 고려하지 않습니다.</li>
              <li>본 서비스의 정보를 투자 의사결정의 유일한 근거로 사용하지 마십시오.</li>
            </ul>
          </section>

          <section id="accuracy" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">2. 정확성 보장 안 함</h2>
            <p>
              서비스는 제공하는 정보의 정확성·완전성·최신성을 보장하지 않습니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>AI가 생성한 테마 분석 및 섹터 분류는 알고리즘 특성상 오류가 포함될 수 있습니다.</li>
              <li>시장 데이터는 외부 제공업체로부터 수신하며, 오탈자·누락·왜곡이 발생할 수 있습니다.</li>
              <li>서비스는 정보의 오류 발견 시 합리적 노력을 다해 수정하지만, 즉각적인 수정을 보장하지 않습니다.</li>
            </ul>
          </section>

          <section id="investment-loss" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">3. 투자 손실 책임 없음</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-3">
              <p className="text-amber-800 text-xs font-bold">주식 투자에는 원금 손실 위험이 있습니다.</p>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600">
              <li>본 서비스 정보를 참고한 투자로 발생한 손실·손해에 대해 서비스는 어떠한 법적·도의적 책임도 지지 않습니다.</li>
              <li>과거 수익률이나 AI 분석 결과가 미래 성과를 보장하지 않습니다.</li>
              <li>이용자는 투자 전 금융 전문가와 상담하거나 본인의 판단하에 신중히 결정하시기 바랍니다.</li>
            </ul>
          </section>

          <section id="data-delay" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">4. 데이터 지연·오류 책임 한계</h2>
            <p>
              서비스가 표시하는 시장 데이터는 실시간이 아닌 <strong>지연된 데이터</strong>일 수 있습니다.
            </p>
            <div className="mt-3 rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">데이터 종류</th>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">지연 가능 범위</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">한국 주식 거래대금</td>
                    <td className="px-4 py-2.5 text-slate-600">최대 15~20분</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">글로벌 ETF·지수</td>
                    <td className="px-4 py-2.5 text-slate-600">최대 수 시간 (API 정책에 따라 상이)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">AI 테마 분석</td>
                    <td className="px-4 py-2.5 text-slate-600">당일 장 마감 후 업데이트</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>외부 데이터 제공업체의 API 장애·정책 변경으로 데이터가 제공되지 않을 수 있습니다.</li>
              <li>데이터 지연·오류·누락으로 인해 발생한 손해에 대해 서비스는 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section id="ai-analysis" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">5. AI 분석 결과의 한계</h2>
            <p>
              본 서비스의 테마 분류 및 섹터 분석은 대형언어모델(LLM)을 활용합니다.
              AI 특성상 아래와 같은 한계가 존재합니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-600">
              <li>동일한 입력에 대해 결과가 달라질 수 있습니다.</li>
              <li>최신 시장 상황이나 기업 이슈를 완전히 반영하지 못할 수 있습니다.</li>
              <li>AI 분석 결과는 참고 의견이며 전문 애널리스트의 리포트를 대체하지 않습니다.</li>
            </ul>
          </section>

          <section id="external-links" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">6. 외부 정보 출처</h2>
            <p>
              서비스는 한국거래소, Yahoo Finance, Alpha Vantage 등 외부 기관의 데이터를 활용합니다.
              해당 기관의 데이터 품질·가용성에 대한 책임은 각 기관에 있으며, 서비스는 외부 데이터의 정확성을 별도로 검증하지 않습니다.
            </p>
          </section>

          <section id="contact" className="scroll-mt-8">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">7. 문의</h2>
            <div className="bg-slate-50 rounded-xl px-5 py-4 text-xs text-slate-600 space-y-1">
              <p>면책조항 관련 문의는 아래로 연락해 주시기 바랍니다.</p>
              <p className="mt-2"><span className="font-bold text-slate-700">이메일:</span> TODO@kostock.com</p>
              <p className="text-slate-400 text-[10px] mt-1">※ 추후 실제 담당자 정보로 업데이트 예정</p>
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
