import React, { useState } from 'react';
import {
  SourceActivity,
  DeveloperActivity,
} from '../api/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Code, MessageSquare, CheckCircle, Terminal } from 'lucide-react';

interface ActivityViewProps {
  sources: SourceActivity[];
  developers: DeveloperActivity[];
}

const SOURCE_COLORS: Record<string, string> = {
  GitHub: '#6366f1', // Indigo
  Slack: '#f43f5e',  // Rose
  Jira: '#06b6d4',   // Cyan
  IDE: '#10b981',    // Emerald
};

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  GitHub: <Code className="h-5 w-5 text-indigo-400" />,
  Slack: <MessageSquare className="h-5 w-5 text-rose-400" />,
  Jira: <CheckCircle className="h-5 w-5 text-cyan-400" />,
  IDE: <Terminal className="h-5 w-5 text-emerald-400" />,
};

export const ActivityView: React.FC<ActivityViewProps> = ({
  sources,
  developers,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'events' | 'duration'>(
    'duration'
  );

  const totalMinutes = sources.reduce(
    (acc, s) => acc + s.total_recorded_duration_minutes,
    0
  );
  const totalEvents = sources.reduce((acc, s) => acc + s.total_events, 0);

  const pieData = sources.map((s) => ({
    name: s.source,
    value:
      selectedMetric === 'duration'
        ? s.total_recorded_duration_minutes
        : s.total_events,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards per Source */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sources.map((src) => (
          <div
            key={src.source}
            className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-white tracking-wide font-mono">
                {src.source}
              </span>
              <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-2">
                {SOURCE_ICONS[src.source] || <Code className="h-4 w-4" />}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-white">
                {src.total_recorded_duration_minutes.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">min</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>{src.total_events} events</span>
                <span>{src.average_event_duration_minutes}m avg</span>
              </div>
            </div>
            <div
              className="absolute inset-x-0 bottom-0 h-1"
              style={{ backgroundColor: SOURCE_COLORS[src.source] || '#6366f1' }}
            />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Source Duration vs Events Breakdown */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Activity Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Share of developer activity by tool
              </p>
            </div>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                onClick={() => setSelectedMetric('duration')}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  selectedMetric === 'duration'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Duration
              </button>
              <button
                onClick={() => setSelectedMetric('events')}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  selectedMetric === 'events'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Events
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={`pie-${entry.name}`}
                      fill={SOURCE_COLORS[entry.name] || '#6366f1'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const val = Number(data.value);
                      const total =
                        selectedMetric === 'duration'
                          ? totalMinutes
                          : totalEvents;
                      const pct = ((val / total) * 100).toFixed(1);
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 shadow-xl font-mono text-xs text-slate-200">
                          <p className="font-semibold text-white">{data.name}</p>
                          <p className="text-indigo-400">
                            {val.toLocaleString()}{' '}
                            {selectedMetric === 'duration' ? 'minutes' : 'events'} ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Duration per Event by Tool */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Average Event Duration by Source
            </h3>
            <p className="text-xs text-slate-400">
              Mean time investment per tool interaction
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sources}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <XAxis
                  dataKey="source"
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
                  unit="m"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as SourceActivity;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 shadow-xl font-mono text-xs text-slate-200">
                          <p className="font-semibold text-white mb-1">
                            {data.source}
                          </p>
                          <p className="text-emerald-400">
                            Avg Duration: {data.average_event_duration_minutes} min
                          </p>
                          <p className="text-slate-400">
                            Total Events: {data.total_events}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="average_event_duration_minutes"
                  radius={[6, 6, 0, 0]}
                >
                  {sources.map((entry) => (
                    <Cell
                      key={`bar-${entry.source}`}
                      fill={SOURCE_COLORS[entry.source] || '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Developer Source Breadth Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Developer Activity & Source Breadth
          </h3>
          <p className="text-xs text-slate-400">
            Recorded event time and unique source interaction per developer
          </p>
        </div>

        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Developer</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Total Events</th>
                <th className="pb-3 font-medium text-right">Recorded Duration</th>
                <th className="pb-3 font-medium text-right">Avg Duration</th>
                <th className="pb-3 font-medium text-right">Unique Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {developers.map((dev) => (
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
                    {dev.average_event_duration_minutes} min
                  </td>
                  <td className="py-3 text-right text-emerald-400 font-semibold">
                    {dev.unique_sources} / 4
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
