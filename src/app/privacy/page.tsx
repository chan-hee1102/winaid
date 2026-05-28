import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: '개인정보처리방침 | KOSTOCK Pro',
  description: 'KOSTOCK Pro 개인정보처리방침',
};

const toc = [
  { id: 'p1',  label: '1. 수집하는 개인정보 항목' },
  { id: 'p2',  label: '2. 개인정보 수집·이용 목적' },
  { id: 'p3',  label: '3. 보유·이용 기간' },
  { id: 'p4',  label: '4. 개인정보 파기 절차 및 방법' },
  { id: 'p5',  label: '5. 제3자 제공' },
  { id: 'p6',  label: '6. 처리 위탁 및 국외 이전' },
  { id: 'p7',  label: '7. 정보주체의 권리' },
  { id: 'p8',  label: '8. 쿠키 정책' },
  { id: 'p9',  label: '9. 개인정보 보호 조치' },
  { id: 'p10', label: '10. 개인정보보호책임자' },
];

export default function PrivacyPage() {
  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] font-sans">

      {/* 헤더 */}
      <div className="bg-slate-900 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            ← KOSTOCK Pro
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tighter mt-3">개인정보처리방침</h1>
          <p className="text-slate-400 text-sm mt-2">
            주식회사 팀에이아이팜 · 시행일: 2026년 3월 30일
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* 개요 */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-5 mb-8 text-sm text-indigo-800 leading-relaxed">
          주식회사 팀에이아이팜(이하 "회사")은 이용자의 개인정보를 중요시하며,
          「개인정보 보호법」 및 관련 법령을 준수합니다. 본 방침은 회사가 운영하는
          KOSTOCK Pro 서비스에 적용됩니다.
        </div>

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

          <Section id="p1" title="1. 수집하는 개인정보 항목">
            <p className="mb-3">회사는 회원가입 및 서비스 이용 과정에서 아래 정보를 수집합니다.</p>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">구분</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">항목</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">수집 방법</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">필수</td>
                    <td className="px-4 py-3 text-slate-600">이메일 주소, 비밀번호(암호화), 이름, 생년월일</td>
                    <td className="px-4 py-3 text-slate-500">회원가입 시 직접 입력</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">소셜 로그인</td>
                    <td className="px-4 py-3 text-slate-600">이메일 주소 (Google 계정에서 제공)</td>
                    <td className="px-4 py-3 text-slate-500">Google OAuth 인증 시</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">자동 수집</td>
                    <td className="px-4 py-3 text-slate-600">서비스 이용 기록, 접속 IP, 브라우저 종류·버전, 쿠키</td>
                    <td className="px-4 py-3 text-slate-500">서비스 이용 중 자동 생성</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">결제</td>
                    <td className="px-4 py-3 text-slate-600">결제 수단 정보 (카드 번호 등은 PG사에서 직접 수집)</td>
                    <td className="px-4 py-3 text-slate-500">유료 구독 결제 시</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="p2" title="2. 개인정보 수집·이용 목적">
            <div className="space-y-3">
              {[
                { label: '회원 관리', desc: '회원 식별, 본인 확인, 부정 이용 방지' },
                { label: '서비스 제공', desc: '콘텐츠 제공, 맞춤 서비스 운영' },
                { label: '유료 서비스', desc: '구독 결제, 청구, 환불 처리' },
                { label: '서비스 개선', desc: '이용 통계 분석, 신규 기능 개발' },
                { label: '법령 의무', desc: '전자상거래법 등 관계 법령 준수' },
                { label: '고객 지원', desc: '문의 응대, 불만 처리, 공지사항 전달' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                  <p className="text-slate-600 text-xs"><span className="font-bold text-slate-700">{label}:</span> {desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="p3" title="3. 개인정보 보유·이용 기간">
            <p className="mb-3">원칙적으로 <strong>회원 탈퇴 시 즉시 파기</strong>합니다. 단, 관계 법령에 따라 아래 정보는 지정 기간 보관합니다.</p>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">항목</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">보관 기간</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">근거 법령</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    ['계약·청약철회 기록', '5년', '전자상거래법 제6조'],
                    ['대금결제·공급 기록', '5년', '전자상거래법 제6조'],
                    ['소비자 불만·분쟁처리 기록', '3년', '전자상거래법 제6조'],
                    ['접속 로그 (IP 등)', '3개월', '통신비밀보호법 제15조의2'],
                  ].map(([item, period, law]) => (
                    <tr key={item}>
                      <td className="px-4 py-3 text-slate-700 font-medium">{item}</td>
                      <td className="px-4 py-3 text-slate-600">{period}</td>
                      <td className="px-4 py-3 text-slate-500">{law}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="p4" title="4. 개인정보 파기 절차 및 방법">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1.5">파기 절차</p>
                <p className="text-slate-600 text-xs">이용 목적이 달성된 후 별도의 DB(또는 문서함)에 옮겨 내부 방침 및 관련 법령에 따라 일정 기간 보관 후 파기합니다.</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1.5">파기 방법</p>
                <ul className="space-y-1 list-disc list-inside text-xs text-slate-600">
                  <li>전자 파일: 복구 불가한 방법으로 영구 삭제</li>
                  <li>출력물 등 기록물: 분쇄 또는 소각</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="p5" title="5. 개인정보의 제3자 제공">
            <p className="mb-3">회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우는 예외입니다.</p>
            <ul className="space-y-1 list-disc list-inside text-slate-600">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의거하거나 수사기관의 적법한 요청이 있는 경우</li>
              <li>서비스 제공에 관한 계약 이행을 위해 필요한 경우로서 이용자의 사전 동의를 받은 경우</li>
            </ul>
          </Section>

          <Section id="p6" title="6. 개인정보 처리 위탁 및 국외 이전">
            <p className="mb-3">회사는 원활한 서비스 운영을 위해 아래 업체에 개인정보 처리를 위탁합니다.</p>
            <div className="rounded-xl border border-slate-100 overflow-hidden mb-4">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">수탁업체</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">위탁 업무</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500">보유 기간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="px-4 py-3 text-slate-700 font-medium">Supabase Inc.</td>
                    <td className="px-4 py-3 text-slate-600">회원 인증 및 데이터 저장</td>
                    <td className="px-4 py-3 text-slate-500">회원 탈퇴 시까지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700 font-medium">(주)코리아포트원</td>
                    <td className="px-4 py-3 text-slate-600">결제 처리 및 결제 데이터 관리</td>
                    <td className="px-4 py-3 text-slate-500">서비스 이용계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700 font-medium">Railway (Render Inc.)</td>
                    <td className="px-4 py-3 text-slate-600">서버 인프라 운영</td>
                    <td className="px-4 py-3 text-slate-500">서비스 종료 시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-xs text-slate-600">
              <p className="font-bold text-slate-700 mb-1.5">📌 개인정보 국외 이전 고지</p>
              <p>위탁업체 중 <strong>Supabase Inc.</strong> 및 <strong>Railway (Render Inc.)</strong>는 미국에 서버를 두고 있어 개인정보가 국외로 이전될 수 있습니다. 이전되는 항목·국가·일시·방법은 위탁 계약을 통해 보호되며, 이용자는 서비스 가입 시 이에 동의한 것으로 간주합니다.</p>
            </div>
          </Section>

          <Section id="p7" title="7. 정보주체의 권리 및 행사 방법">
            <p className="mb-3">이용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['개인정보 열람 요구', '오류 정정 요구', '삭제 요구', '처리 정지 요구'].map((right) => (
                <div key={right} className="bg-slate-50 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 text-center">
                  {right}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              권리 행사는 서비스 내 <strong>마이페이지 → 회원 탈퇴</strong> 또는 아래 개인정보보호책임자에게 이메일로 신청하실 수 있습니다.
              회사는 요청 접수 후 <strong>10일 이내</strong>에 처리 결과를 안내합니다.
            </p>
          </Section>

          <Section id="p8" title="8. 쿠키(Cookie) 정책">
            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-700 mb-1.5">쿠키란?</p>
                <p>쿠키는 웹사이트가 이용자의 브라우저에 저장하는 소량의 텍스트 파일로, 서비스 이용 환경 기억·개선에 활용됩니다.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1.5">사용하는 쿠키 종류</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>필수 쿠키:</strong> 로그인 세션 유지, 서비스 정상 작동에 반드시 필요</li>
                  <li><strong>기능 쿠키:</strong> 사용자 설정 저장 (테마, 언어 등)</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1.5">쿠키 거부 방법</p>
                <p>브라우저 설정에서 쿠키를 거부할 수 있습니다. 단, 필수 쿠키를 거부할 경우 로그인 등 일부 서비스 이용이 불가할 수 있습니다.</p>
              </div>
            </div>
          </Section>

          <Section id="p9" title="9. 개인정보 보호 조치">
            <p className="mb-3">회사는 개인정보 보호를 위해 다음과 같은 기술적·관리적 조치를 취하고 있습니다.</p>
            <div className="space-y-3">
              {[
                { icon: '🔒', label: '암호화', desc: '비밀번호는 단방향 암호화(해시)로 저장되며, 통신 구간은 TLS/HTTPS로 암호화됩니다.' },
                { icon: '🛡', label: '접근 통제', desc: '최소 권한 원칙에 따라 개인정보에 접근할 수 있는 담당자를 제한합니다.' },
                { icon: '🔑', label: '인증 보안', desc: 'Supabase Auth를 통해 안전한 인증 인프라를 운영합니다.' },
                { icon: '📋', label: '정기 점검', desc: '개인정보 처리 현황을 정기적으로 점검·관리합니다.' },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="flex gap-3">
                  <span className="shrink-0 text-base">{icon}</span>
                  <p className="text-slate-600 text-xs"><span className="font-bold text-slate-700">{label}:</span> {desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="p10" title="10. 개인정보보호책임자">
            <p className="text-xs text-slate-600 mb-4">
              개인정보 관련 문의, 불만 처리, 피해 구제 등에 관한 사항은 아래 담당자에게 연락하여 주시기 바랍니다.
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-100 px-5 py-5 text-xs space-y-2">
              {[
                { label: '성명', value: '임찬호 (대표이사)' },
                { label: '소속', value: '주식회사 팀에이아이팜' },
                { label: '이메일', value: 'mukkeby99@gmail.com' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4">
                  <span className="w-12 shrink-0 font-bold text-slate-500">{label}</span>
                  <span className="text-slate-700">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              또한 개인정보 침해 관련 분쟁 해결 및 상담은 아래 기관에 문의하실 수 있습니다.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500 list-disc list-inside">
              <li>개인정보 분쟁조정위원회: <span className="text-slate-600">www.kopico.go.kr</span> / 1833-6972</li>
              <li>개인정보 침해 신고센터: <span className="text-slate-600">privacy.kisa.or.kr</span> / 118</li>
              <li>대검찰청 사이버범죄수사단: <span className="text-slate-600">www.spo.go.kr</span> / 1301</li>
              <li>경찰청 사이버수사국: <span className="text-slate-600">ecrm.cyber.go.kr</span> / 182</li>
            </ul>
          </Section>

          {/* 부칙 */}
          <div className="px-8 py-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-3">부칙</h3>
            <p className="text-sm text-slate-600">이 방침은 <strong>2026년 3월 30일</strong>부터 시행합니다.</p>
          </div>

        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-slate-400">
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">이용약관</Link>
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
