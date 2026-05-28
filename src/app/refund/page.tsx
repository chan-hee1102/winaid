import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: '환불정책 | KOSTOCK Pro',
  description: 'KOSTOCK Pro 환불 및 구독 취소 정책',
};

const toc = [
  { id: 'art1', label: '제1조 환불 원칙' },
  { id: 'art2', label: '제2조 전액 환불 조건' },
  { id: 'art3', label: '제3조 환불 불가 조건' },
  { id: 'art4', label: '제4조 구독 취소' },
  { id: 'art5', label: '제5조 환불 신청 방법' },
  { id: 'art6', label: '제6조 환불 처리 기간' },
];

export default function RefundPage() {
  return (
    <>
    <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 font-sans">

      {/* 헤더 */}
      <div className="bg-slate-900 dark:bg-gray-900 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            ← KOSTOCK Pro
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tighter mt-3">환불정책</h1>
          <p className="text-slate-400 text-sm mt-2">
            주식회사 팀에이아이팜 · 시행일: 2026년 4월 26일
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* 목차 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-6 mb-8">
          <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-4">목차</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-xs text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline py-0.5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm divide-y divide-slate-50 dark:divide-gray-800">

          <Section id="art1" title="제1조 (환불 원칙)">
            <p>주식회사 팀에이아이팜(이하 "회사")은 전자상거래 등에서의 소비자보호에 관한 법률 및 관련 법령에 따라 KOSTOCK Pro(이하 "서비스") 이용자의 청약철회 및 환불 권리를 보장합니다.</p>
            <p className="mt-3">환불은 아래 각 조에서 정한 기준에 따라 처리되며, 이용자는 환불 요청 전 해당 조건을 확인하시기 바랍니다.</p>
          </Section>

          <Section id="art2" title="제2조 (전액 환불 조건)">
            <Callout color="indigo" icon="✅">
              <p className="font-bold text-indigo-800 dark:text-indigo-300 text-xs mb-1">전액 환불 가능</p>
              <p className="text-indigo-700 dark:text-indigo-400 text-xs">유료 구독 결제일로부터 <strong>24시간 이내</strong>에 환불을 요청하시면 전액 환불이 가능합니다.</p>
            </Callout>
            <ul className="mt-4 space-y-2 list-disc list-inside text-slate-600 dark:text-gray-400">
              <li>결제일로부터 24시간 이내에 환불 요청한 경우</li>
              <li>전액 환불되며 별도의 위약금이 발생하지 않습니다.</li>
            </ul>
          </Section>

          <Section id="art3" title="제3조 (환불 불가 조건)">
            <Callout color="amber" icon="⚠">
              <p className="font-bold text-amber-800 dark:text-amber-300 text-xs mb-1">환불이 제한되는 경우</p>
              <p className="text-amber-700 dark:text-amber-400 text-xs">결제 후 <strong>24시간이 경과</strong>한 경우 디지털 콘텐츠의 특성상 환불이 불가합니다.</p>
            </Callout>
            <ul className="mt-4 space-y-2 list-disc list-inside text-slate-600 dark:text-gray-400">
              <li>결제일로부터 24시간이 경과한 경우</li>
              <li>구독 기간이 만료된 이후 환불을 요청하는 경우</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500 dark:text-gray-500">
              본 환불 제한은 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따른 디지털 콘텐츠 특성에 근거합니다.
            </p>
          </Section>

          <Section id="art4" title="제4조 (구독 취소)">
            <Callout color="indigo" icon="ℹ️">
              <p className="font-bold text-indigo-800 dark:text-indigo-300 text-xs mb-1">구독 취소 안내</p>
              <p className="text-indigo-700 dark:text-indigo-400 text-xs">구독은 <strong>언제든지 취소</strong>하실 수 있습니다.</p>
            </Callout>
            <ul className="mt-4 space-y-2 list-disc list-inside text-slate-600 dark:text-gray-400">
              <li>구독 취소는 마이페이지에서 언제든지 가능합니다.</li>
              <li>취소 시 <strong>당월 말까지 서비스가 유지</strong>됩니다.</li>
              <li>취소 이후 다음 결제일부터 요금이 청구되지 않습니다.</li>
              <li>취소 시 즉시 서비스가 종료되지 않으며, 이미 결제된 구독 기간은 끝까지 이용하실 수 있습니다.</li>
            </ul>
          </Section>

          <Section id="art5" title="제5조 (환불 신청 방법)">
            <p>환불을 요청하시려면 아래 이메일로 문의해 주세요.</p>
            <div className="mt-4 px-5 py-4 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400 w-20 shrink-0">환불 문의</span>
                <a
                  href="mailto:service@taif.kr"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  service@taif.kr
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400 w-20 shrink-0">기재 사항</span>
                <span className="text-xs text-slate-600 dark:text-gray-400">가입 이메일, 결제일, 환불 사유</span>
              </div>
            </div>
          </Section>

          <Section id="art6" title="제6조 (환불 처리 기간)">
            <p>환불 요청 접수 후 영업일 기준 <strong>3~5일</strong> 이내에 처리됩니다.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-600 dark:text-gray-400">
              <li>환불은 원결제 수단(신용카드 등)으로 처리됩니다.</li>
              <li>카드사 정책에 따라 실제 취소 반영까지 추가 기간이 소요될 수 있습니다.</li>
              <li>영업일은 주말 및 공휴일을 제외한 평일을 기준으로 합니다.</li>
            </ul>
          </Section>

          {/* 부칙 */}
          <div className="px-8 py-6">
            <h3 className="text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-3">부칙</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400">이 환불정책은 <strong>2026년 4월 26일</strong>부터 시행합니다.</p>
          </div>

        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-slate-400 dark:text-gray-600">
          <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">이용약관</Link>
          <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">개인정보처리방침</Link>
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">홈으로</Link>
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
      <h2 className="text-base font-extrabold text-slate-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
        {title}
      </h2>
      <div className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}

function Callout({ color, icon, children }: { color: 'amber' | 'indigo'; icon: string; children: React.ReactNode }) {
  const styles = {
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
  };
  return (
    <div className={`border rounded-xl px-5 py-4 flex gap-3 ${styles[color]}`}>
      <span className="text-base shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
}
