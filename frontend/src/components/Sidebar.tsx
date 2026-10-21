import React from 'react';
import {
  Activity,
  Layers,
  Users,
  Zap,
  ExternalLink,
  Cpu,
  BarChart2,
} from 'lucide-react';
import { API_BASE_URL } from '../api/client';

export type NavTab = 'overview' | 'activity' | 'teams' | 'flow';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Control Tower',
      sublabel: 'Executive Flow & KPIs',
      icon: Activity,
    },
    {
      id: 'activity' as NavTab,
      label: 'Activity Analytics',
      sublabel: 'Source Load & Durations',
      icon: BarChart2,
    },
    {
      id: 'teams' as NavTab,
      label: 'Team Comparisons',
      sublabel: 'Team A vs Team B & Roles',
      icon: Users,
    },
    {
      id: 'flow' as NavTab,
      label: 'Flow & Focus Sessions',
      sublabel: 'Context Switches & IDE Deep Work',
      icon: Zap,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#070b12] border-r border-slate-800/80 p-4">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2 pt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold tracking-tight text-white font-mono text-base">
                CogniStream
              </span>
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Flow-State & Cognitive Load
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Analytics Views
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div
                  className={`rounded-lg p-1.5 transition-colors ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="space-y-3 pt-6 border-t border-slate-800/80">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>FastAPI Server</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>:8000</span>
            </span>
          </div>
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors pt-1 font-mono"
          >
            <span>Swagger Docs</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="px-2 text-[10px] text-slate-600 flex justify-between items-center font-mono">
          <span>Phase 3B Production</span>
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3 text-slate-500" />
            Polars & FastAPI
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 flex-col">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
