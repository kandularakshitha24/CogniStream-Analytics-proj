import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate';
  };
  icon?: LucideIcon;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
}) => {
  const badgeStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    slate: 'bg-slate-800/80 text-slate-400 border-slate-700/50',
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/70">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
              {value}
            </h3>
            {badge && (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${badgeStyles[badge.variant]}`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-2.5 text-slate-400 shadow-inner">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
    </div>
  );
};
