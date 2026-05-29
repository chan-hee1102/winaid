'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const SPECIALTIES = [
  '피부과', '치과', '성형외과', '내과', '정형외과', '안과', '이비인후과',
  '산부인과', '소아과', '한의원', '정신건강의학과', '비뇨기과', '신경과',
];

const CONTENT_TYPES = [
  { value: 'instagram', label: 'Instagram 게시물' },
  { value: 'naver_blog', label: '네이버 블로그 제목' },
  { value: 'kakao_message', label: '카카오채널 메시지' },
];

export default function ContentGeneratorPage() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState('피부과');
  const [contentType, setContentType] = useState('instagram');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (loading) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/login'); return; }

    setLoading(true);
    setError('');
    setVariations([]);

    try {
      const res = await fetch('/api/ai/content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ specialty, contentType, keyword }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || '오류가 발생했습니다.'); return; }
      setVariations(data.variations || []);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const TONE_LABELS = ['정보형', '감성형', '혜택강조형'];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI 마케팅 콘텐츠 생성기</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          진료과와 키워드를 선택하면 AI가 마케팅 문구 3가지 변형을 생성합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* 입력 패널 */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4">설정</h2>

          <div className="space-y-4">
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
              <label className="block text-xs font-bold text-slate-500 mb-2">콘텐츠 유형</label>
              <div className="space-y-2">
                {CONTENT_TYPES.map(ct => (
                  <label key={ct.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contentType"
                      value={ct.value}
                      checked={contentType === ct.value}
                      onChange={() => setContentType(ct.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{ct.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                키워드 / 시술명 <span className="text-slate-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="예: 보톡스, 스케일링, 도수치료"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  생성 중...
                </>
              ) : '콘텐츠 생성하기'}
            </button>
          </div>
        </div>

        {/* 출력 패널 */}
        <div className="md:col-span-3 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {loading && (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && variations.length === 0 && !error && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">📣</div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">왼쪽에서 설정 후 생성하면 여기에 3가지 변형이 나타납니다.</p>
            </div>
          )}

          {!loading && variations.map((v, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                  변형 {idx + 1} · {TONE_LABELS[idx]}
                </span>
                <button
                  onClick={() => handleCopy(v, idx)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copiedIdx === idx ? (
                    <><svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>복사됨</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>복사</>
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
