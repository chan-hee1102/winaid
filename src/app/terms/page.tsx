import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: '이용약관 | MediAI',
  description: 'MediAI 서비스 이용약관',
};

const toc = [
  { id: 'art1',  label: '제1조 목적' },
  { id: 'art2',  label: '제2조 용어 정의' },
  { id: 'art3',  label: '제3조 약관의 효력 및 변경' },
  { id: 'art4',  label: '제4조 서비스 성격 및 의료광고법 준수 의무' },
  { id: 'art5',  label: '제5조 이용 자격' },
  { id: 'art6',  label: '제6조 서비스 내용' },
  { id: 'art7',  label: '제7조 유료 구독 및 결제' },
  { id: 'art8',  label: '제8조 청약철회 및 환불' },
  { id: 'art9',  label: '제9조 서비스 변경·중단' },
  { id: 'art10', label: '제10조 이용자 의무' },
  { id: 'art11', label: '제11조 지식재산권' },
  { id: 'art12', label: '제12조 면책조항' },
  { id: 'art13', label: '제13조 준거법 및 분쟁 해결' },
];

export default function TermsPage() {
  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] font-sans">

      {/* 헤더 */}
      <div className="bg-slate-900 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            ← MediAI
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tighter mt-3">이용약관</h1>
          <p className="text-slate-400 text-sm mt-2">
            주식회사 팀에이아이팜 · 시행일: 2026년 5월 29일
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* 목차 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">목차</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-xs text-slate-500 hover:text-indigo-600 hover:underline py-0.5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-50">

          <Section id="art1" title="제1조 (목적)">
            <p>이 약관은 주식회사 팀에이아이팜(이하 &quot;회사&quot;)이 운영하는 MediAI(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 이용자와 회사 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </Section>

          <Section id="art2" title="제2조 (용어 정의)">
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <dl className="mt-3 space-y-2">
              <div className="flex gap-3">
                <dt className="shrink-0 text-xs font-bold text-slate-700 w-20">① &quot;서비스&quot;</dt>
                <dd className="text-slate-600 text-xs">회사가 운영하는 MediAI(병원 AI 마케팅 어시스턴트) 및 이와 관련된 일체의 서비스를 말합니다.</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 text-xs font-bold text-slate-700 w-20">② &quot;이용자&quot;</dt>
                <dd className="text-slate-600 text-xs">이 약관에 동의하고 서비스를 이용하는 의료기관 종사자 및 마케팅 담당자를 말합니다.</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 text-xs font-bold text-slate-700 w-20">③ &quot;회원&quot;</dt>
                <dd className="text-slate-600 text-xs">서비스에 회원가입하여 이용자 아이디(ID)를 부여받은 자를 말합니다.</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 text-xs font-bold text-slate-700 w-20">④ &quot;유료 서비스&quot;</dt>
                <dd className="text-slate-600 text-xs">회사가 유료로 제공하는 구독형 서비스(Pro, Pro 연간, Max 등)를 말합니다.</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 text-xs font-bold text-slate-700 w-20">⑤ &quot;생성 콘텐츠&quot;</dt>
                <dd className="text-slate-600 text-xs">이용자의 입력을 바탕으로 서비스가 인공지능을 통해 생성한 텍스트 결과물(리뷰 답변, SNS 게시물, FAQ 등)을 말합니다.</dd>
              </div>
            </dl>
          </Section>

          <Section id="art3" title="제3조 (약관의 효력 및 변경)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 이 약관을 변경할 수 있습니다.</li>
              <li>약관을 변경하는 경우 적용 일자 및 변경 사유를 명시하여 현행 약관과 함께 서비스 공지사항 또는 이메일을 통해 <strong>변경 적용일 7일 전</strong>부터 공지합니다. 다만, 이용자에게 불리한 변경의 경우에는 <strong>30일 전</strong>에 공지합니다.</li>
              <li>공지 후에도 이의 없이 서비스를 계속 이용하면 변경 약관에 동의한 것으로 간주합니다.</li>
            </ol>
          </Section>

          <Section id="art4" title="제4조 (서비스 성격 및 의료광고법 준수 의무)">
            <Callout color="amber" icon="⚠">
              <p className="font-bold text-amber-800 text-xs mb-1">마케팅 보조 도구로서의 한계</p>
              <p className="text-amber-700 text-xs">본 서비스는 의료기관의 마케팅 콘텐츠 작성을 보조하는 AI 도구이며, 의료행위·의학 자문을 제공하지 않습니다.</p>
            </Callout>
            <ul className="mt-4 space-y-2 list-disc list-inside text-slate-600">
              <li>이용자는 생성 콘텐츠를 외부 매체에 게시하기 전 의료법 제56조 및 관련 고시(의료광고 금지표현 등)에 위배되지 않는지 직접 검토할 의무가 있습니다.</li>
              <li>의료법상 사전심의 대상에 해당하는 광고는 의료광고심의위원회의 심의를 별도로 받아야 하며, 회사는 사전심의를 대행하거나 통과를 보장하지 않습니다.</li>
              <li>AI 특성상 사실관계 오류 또는 부적절한 표현이 포함될 수 있으며, 이용자는 게시 전 사실 확인을 거쳐야 합니다.</li>
              <li>생성 콘텐츠의 게시로 발생한 행정처분·민형사상 책임은 게시 주체인 이용자에게 귀속됩니다.</li>
            </ul>
          </Section>

          <Section id="art5" title="제5조 (이용 자격)">
            <p>다음 조건을 모두 충족하는 자가 서비스를 이용할 수 있습니다.</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600">
              <li>만 14세 이상의 개인</li>
              <li>이 약관 및 개인정보처리방침에 동의한 자</li>
              <li>회사로부터 이용이 제한·정지된 이력이 없는 자</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">서비스의 주요 이용 대상은 국내 의료기관 종사자 및 의료기관의 위임을 받은 마케팅 담당자입니다.</p>
          </Section>

          <Section id="art6" title="제6조 (서비스 내용)">
            <p>회사는 다음 기능을 제공합니다.</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600">
              <li>환자 리뷰에 대한 병원 공식 답변 AI 생성 (네이버·카카오·구글 지도)</li>
              <li>진료과별 마케팅 콘텐츠 AI 생성 (인스타그램, 네이버 블로그 제목, 카카오채널 메시지)</li>
              <li>환자 FAQ 답변 AI 생성</li>
              <li>의료광고법 금지표현 자동 회피를 위한 프롬프트 적용</li>
              <li>유료 회원 대상 일일 사용량 확대 및 우선 처리</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">무료 회원과 유료 회원의 일일 사용 한도 및 기능 차이는 <Link href="/pricing" className="text-indigo-600 hover:underline">요금 안내 페이지</Link>에서 확인하실 수 있습니다.</p>
          </Section>

          <Section id="art7" title="제7조 (유료 구독 및 결제)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>유료 구독 요금 및 결제 주기는 서비스 내 <Link href="/pricing" className="text-indigo-600 hover:underline">요금 안내 페이지</Link>에서 확인할 수 있습니다.</li>
              <li>결제는 <strong>포트원(PortOne)</strong>을 통해 처리됩니다.</li>
              <li>구독은 이용자가 직접 해지하기 전까지 자동으로 갱신됩니다.</li>
              <li>결제 수단의 잔액 부족, 유효기간 만료 등으로 결제가 실패할 경우 서비스 이용이 제한될 수 있습니다.</li>
            </ol>
          </Section>

          <Section id="art8" title="제8조 (청약철회 및 환불)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>이용자는 구독 결제일로부터 <strong>7일 이내</strong>에 별도의 위약금 없이 청약철회를 신청할 수 있습니다. 단, 서비스를 이미 상당 부분 이용한 경우에는 청약철회가 제한될 수 있습니다.</li>
              <li>구독 기간 중 해지 시 <strong>미사용 기간에 대해 일할 계산</strong>하여 환불합니다.</li>
              <li>환불 신청은 고객센터 이메일(<strong>mukkeby99@gmail.com</strong>)을 통해 접수하며, 처리 기간은 영업일 기준 <strong>3~5일</strong>입니다.</li>
              <li>환불은 결제 수단에 따라 카드사 환불 등의 방법으로 처리됩니다.</li>
              <li>상세 환불 정책은 <Link href="/refund" className="text-indigo-600 hover:underline">환불정책 페이지</Link>를 참고하시기 바랍니다.</li>
            </ol>
          </Section>

          <Section id="art9" title="제9조 (서비스 변경·중단)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>회사는 운영상·기술상 필요에 따라 서비스 내용을 변경하거나 중단할 수 있습니다.</li>
              <li>서비스 변경·중단 시 서비스 공지사항 또는 이메일을 통해 <strong>7일 전</strong> 사전 고지합니다.</li>
              <li>긴급 보안 패치, 천재지변, 외부 AI 서비스(Google Gemini API 등) 장애 등 불가피한 사유 발생 시에는 사전 고지 없이 서비스를 중단할 수 있으며, 이 경우 중단 후 즉시 고지합니다.</li>
              <li>유료 서비스 기간 중 회사의 귀책 사유로 서비스가 중단된 경우, 중단 기간에 해당하는 이용 요금을 환불합니다.</li>
            </ol>
          </Section>

          <Section id="art10" title="제10조 (이용자 의무)">
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-600">
              <li>생성 콘텐츠를 검토 없이 그대로 게시하여 의료법·의료광고법을 위반하는 행위</li>
              <li>서비스에 환자의 개인정보·진료기록 등 민감정보를 입력하는 행위</li>
              <li>타인의 계정을 도용하거나 허위 정보로 가입하는 행위</li>
              <li>서비스의 안정적 운영을 방해하거나 서버에 과도한 부하를 주는 행위(자동화 스크립트를 통한 대량 요청 등)</li>
              <li>서비스를 통해 얻은 결과를 제3자에게 유료로 재판매하는 행위</li>
              <li>관련 법령, 약관, 서비스 정책을 위반하는 행위</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">위 행위가 확인된 경우 회사는 사전 통보 없이 서비스 이용을 제한하거나 계정을 해지할 수 있습니다.</p>
          </Section>

          <Section id="art11" title="제11조 (지식재산권)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>서비스 자체(UI, 디자인, 코드, 프롬프트 등)에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.</li>
              <li>이용자의 입력을 바탕으로 생성된 콘텐츠의 사용·수정·게시 권한은 이용자에게 있습니다. 다만 이용자는 해당 콘텐츠를 의료광고법 등 관련 법령을 준수하여 사용해야 합니다.</li>
              <li>회사는 서비스 품질 개선 및 통계 분석을 위해 이용자의 입력·결과 데이터를 식별이 불가능하도록 처리하여 활용할 수 있습니다.</li>
              <li>이용자가 서비스에 입력한 내용에 대한 책임은 해당 이용자에게 있습니다.</li>
            </ol>
          </Section>

          <Section id="art12" title="제12조 (면책조항)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>회사는 천재지변, 전쟁, 인터넷 장애, 외부 AI 서비스(Google Gemini API 등) 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
              <li>이용자의 귀책사유로 발생한 손해에 대해 회사는 책임을 지지 않습니다.</li>
              <li>이용자가 생성 콘텐츠를 게시함으로써 발생한 의료법·의료광고법 위반에 따른 행정처분, 명예훼손, 개인정보 노출 등의 법적 책임은 게시 주체인 이용자에게 귀속됩니다.</li>
              <li>회사는 이용자 상호 간 또는 이용자와 제3자(환자·외부 광고 매체 등) 간의 분쟁에 대해 개입할 의무가 없으며 이로 인한 손해에 대해 책임을 지지 않습니다.</li>
            </ol>
          </Section>

          <Section id="art13" title="제13조 (준거법 및 분쟁 해결)">
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>이 약관은 <strong>대한민국 법령</strong>에 따라 해석·적용됩니다.</li>
              <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호 성실하게 협의합니다.</li>
              <li>협의가 이루어지지 않을 경우 <strong>회사 소재지 관할 법원</strong>을 제1심 전속 관할 법원으로 합니다.</li>
            </ol>
          </Section>

          {/* 부칙 */}
          <div className="px-8 py-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-3">부칙</h3>
            <p className="text-sm text-slate-600">이 약관은 <strong>2026년 5월 29일</strong>부터 시행합니다.</p>
          </div>

        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">개인정보처리방침</Link>
          <Link href="/disclaimer" className="hover:text-indigo-600 transition-colors">면책조항</Link>
          <Link href="/" className="hover:text-indigo-600 transition-colors">홈으로</Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-8 py-7 scroll-mt-6">
      <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
        {title}
      </h2>
      <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

function Callout({ color, icon, children }: { color: 'amber' | 'indigo'; icon: string; children: React.ReactNode }) {
  const styles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };
  return (
    <div className={`border rounded-xl px-5 py-4 flex gap-3 ${styles[color]}`}>
      <span className="text-base shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
}
