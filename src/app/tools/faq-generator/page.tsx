'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const SPECIALTIES = [
  '피부과', '치과', '성형외과', '내과', '정형외과', '안과', '이비인후과',
  '산부인과', '소아과', '한의원', '정신건강의학과', '비뇨기과', '신경과', '기타',
];

interface FaqItem { q: string; a: string; }

export default function FaqGeneratorPage() {
  const router = useRouter();
  const [hospitalName, setHospitalName] = useState('');
  const [specialty, setSpecialty] = useState('피부과');
  const [questions, setQuestions] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');

  const addQuestion = () => {
    if (questions.length < 10) setQuestions(prev => [...prev, '']);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? value : q));
  };

  const handleGenerate = async () => {
    const validQuestions = questions.filter(q => q.trim());
    if (validQuestions.length === 0 || loading) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/login'); return; }

    setLoading(true);
    setError('');
    setFaqItems([]);

    try {
      const res = await fetch('/api/ai/faq-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ hospitalName, specialty, questions: validQuestions }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || '오류가 발생했습니다.'); return; }
      setFaqItems(data.faqItems || []);
      setRawText(data.rawText || '');
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!rawText) return;
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hospitalName || '병원'}_FAQ_${specialty}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = questions.filter(q => q.trim()).length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI 환자 FAQ 생성기</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          자주 묻는 질문을 입력하면 AI가 병원 브랜드에 맞는 전문적인 답변을 생성합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* 입력 패널 */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4">병원 정보 & 질문</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">병원명 <span className="text-slate-400 font-normal">(선택)</span></label>
              <input
                type="text"
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                placeholder="예: 행복피부과"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">진료과</label>
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500">자주 묻는 질문 ({questions.length}/10)</label>
              </div>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={q}
                      onChange={e => updateQuestion(idx, e.target.value)}
                      placeholder={`질문 ${idx + 1}`}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(idx)}
                        className="w-8 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {questions.length < 10 && (
                <button
                  onClick={addQuestion}
                  className="mt-2 w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 border border-dashed border-indigo-300 hover:border-indigo-400 rounded-xl transition-colors"
                >
                  + 질문 추가
                </button>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={validCount === 0 || loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  FAQ 생성 중...
                </>
              ) : `FAQ 생성하기 (${validCount}개 질문)`}
            </button>
          </div>
        </div>

        {/* 출력 패널 */}
        <div className="md:col-span-3">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">{error}</div>
          )}

          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse space-y-4">
              {[0, 1, 2].map(i => (
                <div key={i}>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-1" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                </div>
              ))}
            </div>
          )}

          {!loading && faqItems.length === 0 && !error && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">왼쪽에서 질문을 입력하고 생성하면 여기에 FAQ가 나타납니다.</p>
            </div>
          )}

          {!loading && faqItems.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm">생성된 FAQ ({faqItems.length}개)</h2>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  .txt 다운로드
                </button>
              </div>
              <div className="space-y-4">
                {faqItems.map((item, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'pt-4 border-t border-slate-100 dark:border-slate-800' : ''}`}>
                    <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">Q. {item.q}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">A. {item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
