import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-3"
          >
            <div className="h-3 w-24 rounded bg-slate-800" />
            <div className="h-7 w-32 rounded bg-slate-700/60" />
            <div className="h-2 w-40 rounded bg-slate-800/50" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
          <div className="h-4 w-48 rounded bg-slate-800" />
          <div className="h-60 rounded-lg bg-slate-800/30" />
        </div>
        <div className="h-80 rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
          <div className="h-4 w-48 rounded bg-slate-800" />
          <div className="h-60 rounded-lg bg-slate-800/30" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-slate-800/30" />
          ))}
        </div>
      </div>
    </div>
  );
};
