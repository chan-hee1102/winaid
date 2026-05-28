'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStreamingText } from '@/components/StreamingText';

const HOSPITAL_TYPES = [
  '치과', '피부과', '성형외과', '내과', '정형외과', '안과', '이비인후과',
  '산부인과', '소아과', '한의원', '정신건강의학과', '비뇨기과', '신경과', '기타',
];

export default function ReviewReplyPage() {
  const router = useRouter();
  const [reviewText, setReviewText] = useState('');
  const [hospitalType, setHospitalType] = useState('치과');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const { text, status, generate, reset, component } = useStreamingText(
    '생성된 답변이 여기에 나타납니다.'
  );

  const handleGenerate = async () => {
    if (!reviewText.trim() || isGenerating) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/login'); return; }

    setIsGenerating(true);
    setCopied(false);
    reset();

    await generate('/api/ai/review-reply', { reviewText, hospitalType }, session.access_token);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI 리뷰 답변 생성기</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          환자 리뷰를 붙여넣으면 AI가 의료광고법 준수 병원 공식 답변을 생성합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 입력 패널 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4">환자 리뷰 입력</h2>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">병원 유형</label>
            <select
              value={hospitalType}
              onChange={e => setHospitalType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {HOSPITAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">
              리뷰 원문 <span className="text-slate-400 font-normal">(네이버/카카오/구글 지도)</span>
            </label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="여기에 환자 리뷰를 붙여넣어 주세요.&#10;&#10;예: 원장님이 친절하게 설명해주셔서 좋았습니다. 대기 시간이 조금 길었지만 진료는 만족스러웠어요."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!reviewText.trim() || isGenerating}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                생성 중...
              </>
            ) : (
              'AI 답변 생성하기'
            )}
          </button>
        </div>

        {/* 출력 패널 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm">생성된 답변</h2>
            {(status === 'done' || status === 'streaming') && text && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      복사됨
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      복사
                    </>
                  )}
                </button>
                {status === 'done' && (
                  <button
                    onClick={() => { reset(); handleGenerate(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    다시 생성
                  </button>
                )}
              </div>
            )}
          </div>

          {component}

          {status === 'idle' && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 leading-relaxed">
                의료광고법 준수 규정이 자동으로 적용됩니다. 효과 보장, 비교 광고, 개인정보 언급 등이 자동으로 제외됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
