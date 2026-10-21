import React from 'react';
import {
  Activity,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  DeveloperActivity,
  SourceActivity,
  TeamActivity,
  TeamFlow,
  ContextSwitch,
  IDESession,
} from '../api/types';
import { KPICard } from '../components/KPICard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { NavTab } from '../components/Sidebar';

interface OverviewViewProps {
  developers: DeveloperActivity[];
  sources: SourceActivity[];
  teams: TeamActivity[];
  teamFlow: TeamFlow[];
  contextSwitches: ContextSwitch[];
  sessions: IDESession[];
  onNavigateTab: (tab: NavTab) => void;
}

const SOURCE_COLORS: Record<string, string> = {
  GitHub: '#6366f1', // Indigo
  Slack: '#f43f5e',  // Rose
  Jira: '#06b6d4',   // Cyan
  IDE: '#10b981',    // Emerald
};

export const OverviewView: React.FC<OverviewViewProps> = ({
  developers,
  sources,
  teams,
  teamFlow,
  contextSwitches,
  sessions,
  onNavigateTab,
}) => {
  // Compute overall KPIs
  const totalEvents = developers.reduce((acc, d) => acc + d.total_events, 0);
  const totalDuration = developers.reduce(
    (acc, d) => acc + d.total_recorded_duration_minutes,
    0
  );
  const avgDuration =
    totalEvents > 0 ? (totalDuration / totalEvents).toFixed(1) : '0';

  const totalRapidSwitches = contextSwitches.reduce(
    (acc, c) => acc + c.rapid_source_change_count,
    0
  );
  const candidateSessions = sessions.filter(
    (s) => s.candidate_focus_session === true
  );

  // Format source breakdown data for charts
  const sourceChartData = sources.map((s) => ({
    name: s.source,
    events: s.total_events,
    duration: s.total_recorded_duration_minutes,
    avg: s.average_event_duration_minutes,
  }));

  // Context switch ranking
  const sortedSwitchers = [...contextSwitches].sort(
    (a, b) => b.rapid_source_change_count - a.rapid_source_change_count
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Recorded Events"
          value={totalEvents.toLocaleString()}
          subtitle="Simulated telemetry across 10 active developers"
          badge={{ text: 'Verified', variant: 'indigo' }}
          icon={Activity}
        />
        <KPICard
          title="Avg Event Duration"
          value={`${avgDuration}m`}
          subtitle="Mean recorded time across all 4 event sources"
          badge={{ text: 'Steady', variant: 'slate' }}
          icon={Clock}
        />
        <KPICard
          title="Rapid Context Switches"
          value={totalRapidSwitches.toLocaleString()}
          subtitle="Consecutive source changes ≤15 min apart"
          badge={{ text: 'High Friction', variant: 'rose' }}
          icon={Zap}
        />
        <KPICard
          title="Candidate Focus Sessions"
          value={candidateSessions.length}
          subtitle="Sustained IDE sessions meeting focus criteria"
          badge={{ text: 'Deep Work', variant: 'emerald' }}
          icon={Layers}
        />
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Source Load Distribution */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Activity Distribution by Source
              </h3>
              <p className="text-xs text-slate-400">
                Total event counts across tool channels
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('activity')}
              className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
            >
              <span>Explore Activity</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 shadow-xl font-mono text-xs text-slate-200">
                          <p className="font-semibold text-white mb-1">
                            {data.name}
                          </p>
                          <p className="text-indigo-400">
                            Events: {data.events}
                          </p>
                          <p className="text-slate-400">
                            Duration: {data.duration} min
                          </p>
                          <p className="text-slate-400">
                            Avg: {data.avg} min/event
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="events" radius={[6, 6, 0, 0]}>
                  {sourceChartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={SOURCE_COLORS[entry.name] || '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800/60 text-center">
            {sourceChartData.map((src) => (
              <div key={src.name} className="space-y-0.5">
                <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 font-mono">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: SOURCE_COLORS[src.name] || '#6366f1' }}
                  />
                  <span>{src.name}</span>
                </div>
                <p className="font-mono text-sm font-semibold text-white">
                  {src.events}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Flow Rates */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur flex flex-col justify-between">
          <div className="space-y-1 pb-4 border-b border-slate-800/80">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Team Switch Rates
            </h3>
            <p className="text-xs text-slate-400">
              Tool change frequency across teams
            </p>
          </div>

          <div className="space-y-4 py-4">
            {teamFlow.map((tf) => {
              const teamInfo = teams.find((t) => t.team === tf.team);
              return (
                <div
                  key={tf.team}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{tf.team}</span>
                    <span className="text-rose-400 font-semibold">
                      {tf.source_change_rate_percent}% switch rate
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                      style={{ width: `${tf.source_change_rate_percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>
                      {tf.source_change_count} changes / {tf.consecutive_event_pairs} transitions
                    </span>
                    <span>{teamInfo?.developer_count || 5} devs</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-indigo-950/20 p-3 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Cognitive Friction Insight</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Both teams experience &gt;75% tool hopping on consecutive events, indicating frequent multitasking between IDE, chat, and tickets.
            </p>
          </div>
        </div>
      </div>

      {/* Top Context Switching Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Developer Cognitive Load Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Developers sorted by rapid source change frequency (gap ≤15 min)
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('flow')}
            className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
          >
            <span>View All Sessions</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Developer ID</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Source Changes</th>
                <th className="pb-3 font-medium text-right">Rapid (≤15m)</th>
                <th className="pb-3 font-medium text-right">Inactivity (&gt;60m)</th>
                <th className="pb-3 font-medium text-right">Avg Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedSwitchers.slice(0, 5).map((row) => (
                <tr
                  key={row.developer_id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 font-semibold text-indigo-300">
                    {row.developer_id}
                  </td>
                  <td className="py-3 text-slate-300">{row.team}</td>
                  <td className="py-3 text-slate-400 font-sans">{row.role}</td>
                  <td className="py-3 text-right text-slate-300">
                    {row.source_change_count} / {row.consecutive_event_pairs}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center rounded bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
                      {row.rapid_source_change_count}
                    </span>
                  </td>
                  <td className="py-3 text-right text-amber-400">
                    {row.long_inactivity_gap_count}
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {row.average_gap_minutes}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
