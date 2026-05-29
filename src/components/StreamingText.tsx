'use client';

import { useState, useCallback } from 'react';

interface Props {
  placeholder?: string;
}

export interface StreamingTextHandle {
  generate: (url: string, payload: Record<string, unknown>, token: string) => Promise<void>;
  reset: () => void;
  text: string;
  status: 'idle' | 'streaming' | 'done' | 'error';
}

export function useStreamingText(placeholder = ''): StreamingTextHandle & { component: React.ReactNode } {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const reset = useCallback(() => {
    setText('');
    setStatus('idle');
    setErrorMsg('');
  }, []);

  const generate = useCallback(async (url: string, payload: Record<string, unknown>, token: string) => {
    setText('');
    setStatus('streaming');
    setErrorMsg('');

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `오류 ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('스트림을 읽을 수 없습니다.');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') { setStatus('done'); return; }
          let parsed: { text?: string; error?: string };
          try {
            parsed = JSON.parse(data);
          } catch {
            continue;
          }
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.text) setText(prev => prev + parsed.text);
        }
      }

      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setStatus('error');
    }
  }, []);

  const component = (
    <div className="relative min-h-[120px]">
      {status === 'idle' && !text && (
        <p className="text-slate-400 text-sm">{placeholder}</p>
      )}
      {status === 'error' && (
        <div className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">{errorMsg}</div>
      )}
      {(status === 'streaming' || status === 'done') && (
        <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {text}
          {status === 'streaming' && (
            <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      )}
    </div>
  );

  return { text, status, generate, reset, component };
}
