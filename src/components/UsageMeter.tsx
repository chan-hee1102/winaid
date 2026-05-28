'use client';

interface Props {
  used: number;
  limit: number;
  loading?: boolean;
}

export default function UsageMeter({ used, limit, loading = false }: Props) {
  if (loading) {
    return <div className="h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />;
  }

  const isUnlimited = limit >= 9999;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const remaining = isUnlimited ? '∞' : String(limit - used);
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-indigo-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden w-20">
        {!isUnlimited && (
          <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
        )}
      </div>
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {isUnlimited ? '무제한' : `오늘 ${used}/${limit}회`}
      </span>
    </div>
  );
}
