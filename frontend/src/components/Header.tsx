import React from 'react';
import { Menu, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onOpenMobileNav: () => void;
  isApiOnline: boolean | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileNav,
  isApiOnline,
  onRefresh,
  isRefreshing,
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Developer Flow Control Tower',
      subtitle: 'High-level telemetry, cognitive load friction indicators, and candidate focus metrics',
    },
    activity: {
      title: 'Activity Load & Source Analytics',
      subtitle: 'Time distribution and event volumes across GitHub, Slack, Jira, and IDE',
    },
    teams: {
      title: 'Cross-Team Flow Comparison',
      subtitle: 'Team A vs Team B productivity distribution, role allocations, and source switch rates',
    },
    flow: {
      title: 'Focus Sessions & Context-Switching',
      subtitle: 'IDE deep work sessions, rapid tool hops (≤15 min), and inactivity fragmentation',
    },
  };

  const current = titles[activeTab];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#080c14]/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileNav}
          className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            {current.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-400 truncate max-w-xl">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* API Health Pill */}
        <div className="flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-xs">
          {isApiOnline === true ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-emerald-400">
                API Online
              </span>
              <CheckCircle2 className="h-3 w-3 text-emerald-400 ml-0.5" />
            </>
          ) : isApiOnline === false ? (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-[11px] font-medium text-rose-400">
                API Offline
              </span>
              <XCircle className="h-3 w-3 text-rose-400 ml-0.5" />
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[11px] font-medium text-amber-400">
                Checking...
              </span>
            </>
          )}
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
          title="Refresh analytics data"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
};
