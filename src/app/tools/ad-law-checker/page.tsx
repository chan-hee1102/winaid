'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const HOSPITAL_TYPES = [
  '치과', '피부과', '성형외과', '내과', '정형외과', '안과', '이비인후과',
  '산부인과', '소아과', '한의원', '정신건강의학과', '비뇨기과', '신경과', '기타',
];

const CHANNELS = [
  { value: 'naver_blog', label: '네이버 블로그' },
  { value: 'instagram', label: '인스타그램' },
  { value: 'kakao_channel', label: '카카오채널' },
  { value: 'homepage', label: '병원 홈페이지' },
  { value: 'leaflet', label: '전단지·옥외광고' },
  { value: 'other', label: '기타' },
];

const CATEGORY_LABELS: Record<string, string> = {
  EFFECT_GUARANTEE: '치료효과 보장',
  EXAGGERATION: '과장·확언 표현',
  COMPARATIVE_AD: '비교 우위 광고',
  PATIENT_INDUCEMENT: '환자 유인 행위',
  PRICE_DISPLAY: '비급여 가격 표시',
  BEFORE_AFTER: '시술 전후 비교',
  TESTIMONIAL: '환자 체험기·후기',
  PROFESSIONAL_TITLE: '의료진 자격 과장',
  SAFETY_OMISSION: '부작용 정보 누락',
  OTHER: '기타 위반',
};

interface Violation {
  category: string;
  severity: 'low' | 'medium' | 'high';
  snippet: string;
  reason: string;
  suggestion: string;
}

interface CheckResult {
  overall: 'pass' | 'warning' | 'fail';
  riskScore: number;
  summary: string;
  violations: Violation[];
  rewrite: string;
}

const OVERALL_STYLE = {
  pass:    { label: '통과', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
  warning: { label: '주의', cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' },
  fail:    { label: '위반', cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' },
} as const;

const SEVERITY_STYLE = {
  low:    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  high:   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
} as const;

const SEVERITY_LABEL = { low: '낮음', medium: '중간', high: '높음' } as const;

export default function AdLawCheckerPage() {
  const router = useRouter();
  const [adText, setAdText] = useState('');
  const [channel, setChannel] = useState('naver_blog');
  const [hospitalType, setHospitalType] = useState('치과');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const handleCheck = async () => {
    if (!adText.trim() || loading) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/login'); return; }

    setLoading(true);
    setError('');
    setResult(null);
    setCopiedRewrite(false);

    try {
      const res = await fetch('/api/ai/ad-law-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ adText, channel, hospitalType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `오류 ${res.status}`);
      setResult(data as CheckResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRewrite = async () => {
    if (!result?.rewrite) return;
    await navigator.clipboard.writeText(result.rewrite);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI 의료광고법 검사기</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          작성한 광고 문구를 입력하면 AI가 의료법 제56조 기준으로 위반 항목을 찾아 안전한 표현을 제안합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 입력 패널 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4">광고 문구 입력</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">병원 유형</label>
              <select
                value={hospitalType}
                onChange={e => setHospitalType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {HOSPITAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">게재 매체</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CHANNELS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">
              광고 문구 <span className="text-slate-400 font-normal">(최대 4000자)</span>
            </label>
            <textarea
              value={adText}
              onChange={e => setAdText(e.target.value)}
              placeholder="검토받을 광고 문구를 붙여넣으세요.&#10;&#10;예: 100% 만족 보장! 국내 1위 임플란트 30만원 → 19만원 특가 이벤트"
              rows={10}
              maxLength={4000}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-right text-[11px] text-slate-400 mt-1">{adText.length} / 4000</p>
          </div>

          <button
            onClick={handleCheck}
            disabled={!adText.trim() || loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                검사 중...
              </>
            ) : (
              '의료광고법 검사하기'
            )}
          </button>
        </div>

        {/* 결과 패널 */}
        <div className="space-y-4">
          {!result && !error && !loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="text-sm text-slate-400 text-center">
                검사 결과가 여기에 표시됩니다.<br />
                <span className="text-xs text-slate-300 mt-1 block">의료법 제56조 기준 자동 검토</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-h-[200px] flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400">AI가 의료광고법 위반 항목을 검토 중입니다...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4">
              <p className="text-sm text-red-600 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <>
              {/* 종합 판정 카드 */}
              <div className={`border-2 rounded-2xl p-5 ${OVERALL_STYLE[result.overall].cls}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold">{OVERALL_STYLE[result.overall].label}</span>
                    <span className="text-xs font-bold opacity-70">위반 {result.violations.length}건</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold opacity-70 uppercase tracking-wider">위험도</div>
                    <div className="text-2xl font-extrabold leading-none">{result.riskScore}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{result.summary}</p>
              </div>

              {/* 위반 항목 리스트 */}
              {result.violations.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">위반 항목 상세</h3>
                  <div className="space-y-3">
                    {result.violations.map((v, i) => (
                      <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_STYLE[v.severity]}`}>
                            {SEVERITY_LABEL[v.severity]}
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {CATEGORY_LABELS[v.category] || v.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                          <span className="font-semibold">문제 표현:</span>{' '}
                          <span className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded">&quot;{v.snippet}&quot;</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">사유:</span> {v.reason}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed bg-emerald-50 dark:bg-emerald-950 rounded-lg px-3 py-2">
                          <span className="font-semibold">💡 대체 표현:</span> {v.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI 수정안 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">AI 수정안</h3>
                  <button
                    onClick={handleCopyRewrite}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {copiedRewrite ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        복사됨
                      </>
                    ) : '복사'}
                  </button>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {result.rewrite}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          ⚖️ 본 검사 결과는 AI 보조 도구의 결과물이며 법적 효력이나 사전심의 통과를 보장하지 않습니다.
          최종 게재 전 의료광고심의위원회 사전심의 대상 여부를 확인하시기 바랍니다.
        </p>
      </div>
    </main>
  );
}
