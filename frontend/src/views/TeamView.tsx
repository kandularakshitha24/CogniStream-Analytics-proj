import React, { useState } from 'react';
import {
  TeamActivity,
  TeamFlow,
  DeveloperActivity,
} from '../api/types';
import { Users } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface TeamViewProps {
  teams: TeamActivity[];
  teamFlow: TeamFlow[];
  developers: DeveloperActivity[];
}

export const TeamView: React.FC<TeamViewProps> = ({
  teams,
  teamFlow,
  developers,
}) => {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('All');

  // Filter developers based on user selection
  const filteredDevs =
    selectedTeamFilter === 'All'
      ? developers
      : developers.filter((d) => d.team === selectedTeamFilter);

  // Combine teams and flow metrics for comparison
  const comparisonData = teams.map((t) => {
    const flow = teamFlow.find((f) => f.team === t.team);
    return {
      team: t.team,
      eventsPerDev: t.events_per_developer,
      totalDuration: t.total_recorded_duration_minutes,
      avgDuration: t.average_event_duration_minutes,
      switchRate: flow?.source_change_rate_percent || 0,
      devCount: t.developer_count,
    };
  });

  return (
    <div className="space-y-6">
      {/* Side-by-Side Team Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {teams.map((team) => {
          const flow = teamFlow.find((f) => f.team === team.team);
          return (
            <div
              key={team.team}
              className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-sm backdrop-blur space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-bold text-white">
                      {team.team}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {team.developer_count} Engineers • 5 Engineering Roles
                    </p>
                  </div>
                </div>
                <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-mono text-slate-300">
                  {team.total_events} Total Events
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                    Source Switch Rate
                  </span>
                  <div className="font-mono text-xl font-bold text-rose-400">
                    {flow?.source_change_rate_percent}%
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {flow?.source_change_count} of {flow?.consecutive_event_pairs} transitions
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                    Avg Event Duration
                  </span>
                  <div className="font-mono text-xl font-bold text-white">
                    {team.average_event_duration_minutes}m
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {team.total_recorded_duration_minutes.toLocaleString()} min logged
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Context Stability Index</span>
                  <span className="text-amber-400 font-semibold">
                    {(100 - (flow?.source_change_rate_percent || 0)).toFixed(1)}% Stable
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${100 - (flow?.source_change_rate_percent || 0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Team Comparison: Source Switch Rate vs Duration
          </h3>
          <p className="text-xs text-slate-400">
            Evaluating work stability and cognitive friction across both engineering teams
          </p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="team"
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
                      <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 shadow-xl font-mono text-xs text-slate-200 space-y-1">
                        <p className="font-semibold text-white">{data.team}</p>
                        <p className="text-rose-400">
                          Switch Rate: {data.switchRate}%
                        </p>
                        <p className="text-indigo-400">
                          Avg Duration: {data.avgDuration} min
                        </p>
                        <p className="text-slate-400">
                          Total Logged: {data.totalDuration.toLocaleString()} min
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Bar
                dataKey="switchRate"
                name="Source Switch Rate (%)"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="avgDuration"
                name="Avg Duration (min)"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Developer Roster by Team */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Developer Roster & Role Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Profiles, load allocations, and recorded minutes
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Filter Team:</span>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              {['All', 'Team A', 'Team B'].map((team) => (
                <button
                  key={team}
                  onClick={() => setSelectedTeamFilter(team)}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    selectedTeamFilter === team
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Developer</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Events</th>
                <th className="pb-3 font-medium text-right">Total Recorded</th>
                <th className="pb-3 font-medium text-right">Avg Event Time</th>
                <th className="pb-3 font-medium text-right">Tool Breadth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredDevs.map((dev) => (
                <tr
                  key={dev.developer_id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 font-semibold text-indigo-300">
                    {dev.developer_id}
                  </td>
                  <td className="py-3 text-slate-300">{dev.team}</td>
                  <td className="py-3 text-slate-400 font-sans">{dev.role}</td>
                  <td className="py-3 text-right text-slate-200">
                    {dev.total_events}
                  </td>
                  <td className="py-3 text-right text-indigo-400 font-semibold">
                    {dev.total_recorded_duration_minutes.toLocaleString()} min
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {dev.average_event_duration_minutes}m
                  </td>
                  <td className="py-3 text-right text-emerald-400">
                    {dev.unique_sources} sources
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
