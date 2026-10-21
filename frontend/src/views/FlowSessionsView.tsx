import React, { useState } from 'react';
import {
  IDESession,
  ContextSwitch,
} from '../api/types';
import { KPICard } from '../components/KPICard';
import { FilterBar } from '../components/FilterBar';
import {
  Zap,
  CheckCircle2,
  Clock,
  HelpCircle,
  Terminal,
} from 'lucide-react';

interface FlowSessionsViewProps {
  sessions: IDESession[];
  contextSwitches: ContextSwitch[];
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
  selectedDeveloper: string;
  onSelectDeveloper: (dev: string) => void;
  candidatesOnly: boolean;
  onToggleCandidatesOnly: (val: boolean) => void;
}

export const FlowSessionsView: React.FC<FlowSessionsViewProps> = ({
  sessions,
  contextSwitches,
  selectedTeam,
  onSelectTeam,
  selectedDeveloper,
  onSelectDeveloper,
  candidatesOnly,
  onToggleCandidatesOnly,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'switches'>('sessions');

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (selectedTeam !== 'All' && s.team !== selectedTeam) return false;
    if (selectedDeveloper !== 'All' && s.developer_id !== selectedDeveloper)
      return false;
    if (candidatesOnly && !s.candidate_focus_session) return false;
    return true;
  });

  // Filter switches
  const filteredSwitches = contextSwitches.filter((c) => {
    if (selectedTeam !== 'All' && c.team !== selectedTeam) return false;
    if (selectedDeveloper !== 'All' && c.developer_id !== selectedDeveloper)
      return false;
    return true;
  });

  // Summary Metrics
  const totalRapid = filteredSwitches.reduce(
    (acc, c) => acc + c.rapid_source_change_count,
    0
  );
  const totalInactivity = filteredSwitches.reduce(
    (acc, c) => acc + c.long_inactivity_gap_count,
    0
  );
  const totalCandidateSessions = filteredSessions.filter(
    (s) => s.candidate_focus_session === true
  ).length;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Candidate Focus Sessions"
          value={totalCandidateSessions}
          subtitle="Multi-event IDE sessions with sustained continuity"
          badge={{ text: 'Deep Work', variant: 'emerald' }}
          icon={CheckCircle2}
        />
        <KPICard
          title="Rapid Context Switches"
          value={totalRapid}
          subtitle="Consecutive tool hopping within 15 minutes"
          badge={{ text: 'Friction', variant: 'rose' }}
          icon={Zap}
        />
        <KPICard
          title="Long Inactivity Gaps"
          value={totalInactivity}
          subtitle="Breaks exceeding 60 minutes between events"
          badge={{ text: 'Idle / Break', variant: 'amber' }}
          icon={Clock}
        />
        <KPICard
          title="Filtered IDE Sessions"
          value={filteredSessions.length}
          subtitle={`Out of ${sessions.length} total recorded IDE blocks`}
          badge={{ text: 'Telemetry', variant: 'indigo' }}
          icon={Terminal}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedTeam={selectedTeam}
        onSelectTeam={onSelectTeam}
        selectedDeveloper={selectedDeveloper}
        onSelectDeveloper={onSelectDeveloper}
        candidatesOnly={candidatesOnly}
        onToggleCandidatesOnly={onToggleCandidatesOnly}
        showCandidateToggle={true}
      />

      {/* Methodology Guide Alert */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 space-y-1 font-mono">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
          <HelpCircle className="h-4 w-4" />
          <span>CogniStream Flow-State Methodology</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          • <strong className="text-white">Candidate Focus Session:</strong> IDE activity clusters with multiple sequential IDE interactions, uninterrupted by Slack or Jira context switches.
        </p>
        <p className="leading-relaxed text-slate-300">
          • <strong className="text-white">Rapid Source Change:</strong> Immediate transition from one tool (e.g., IDE) to another (e.g., Slack or Jira) occurring within ≤15 minutes.
        </p>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition-colors ${
            activeTab === 'sessions'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          IDE Sessions Log ({filteredSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('switches')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition-colors ${
            activeTab === 'switches'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Context Switches Matrix ({filteredSwitches.length})
        </button>
      </div>

      {/* View 1: IDE Sessions Table */}
      {activeTab === 'sessions' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur">
          <div className="border-b border-slate-800/80 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                IDE Sessions & Focus Classification
              </h3>
              <p className="text-xs text-slate-400">
                Detailed timeline of IDE coding bursts and focus session tags
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredSessions.length} sessions
            </span>
          </div>

          <div className="overflow-x-auto pt-3">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Developer</th>
                  <th className="pb-3 font-medium">Session #</th>
                  <th className="pb-3 font-medium">Team & Role</th>
                  <th className="pb-3 font-medium text-right">IDE Events</th>
                  <th className="pb-3 font-medium">Window Start - End</th>
                  <th className="pb-3 font-medium text-right">Elapsed</th>
                  <th className="pb-3 font-medium text-right">Duration Sum</th>
                  <th className="pb-3 font-medium text-center">Focus Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-slate-500 font-mono"
                    >
                      No sessions match current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.slice(0, 50).map((s, idx) => (
                    <tr
                      key={`${s.developer_id}-${s.session_number}-${idx}`}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-2.5 font-semibold text-indigo-300">
                        {s.developer_id}
                      </td>
                      <td className="py-2.5 text-slate-400">#{s.session_number}</td>
                      <td className="py-2.5 text-slate-300 font-sans">
                        <span className="text-slate-400 font-mono">{s.team}</span> •{' '}
                        {s.role}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-white">
                        {s.ide_event_count}
                      </td>
                      <td className="py-2.5 text-slate-400 text-[11px]">
                        {s.session_start.replace('T', ' ').slice(0, 16)} →{' '}
                        {s.session_end.slice(11, 16)}
                      </td>
                      <td className="py-2.5 text-right text-slate-300">
                        {s.elapsed_minutes}m
                      </td>
                      <td className="py-2.5 text-right text-indigo-400">
                        {s.sum_recorded_event_duration_minutes}m
                      </td>
                      <td className="py-2.5 text-center">
                        {s.candidate_focus_session ? (
                          <span className="inline-flex items-center space-x-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Candidate Focus</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-slate-700 bg-slate-800/50 px-2 py-0.5 text-[10px] text-slate-400">
                            Standard
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredSessions.length > 50 && (
            <div className="pt-3 text-center text-xs text-slate-500 font-mono">
              Displaying first 50 of {filteredSessions.length} records. Filter by developer for focused examination.
            </div>
          )}
        </div>
      )}

      {/* View 2: Context Switches Table */}
      {activeTab === 'switches' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm backdrop-blur">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Developer Cognitive Switching Summary
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated transition gaps and rapid tool hopping metrics
            </p>
          </div>

          <div className="overflow-x-auto pt-3">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Developer</th>
                  <th className="pb-3 font-medium">Team</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium text-right">Event Pairs</th>
                  <th className="pb-3 font-medium text-right">Source Changes</th>
                  <th className="pb-3 font-medium text-right">Rapid Switched (≤15m)</th>
                  <th className="pb-3 font-medium text-right">Inactivity Gaps (&gt;60m)</th>
                  <th className="pb-3 font-medium text-right">Mean Gap Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredSwitches.map((c) => (
                  <tr
                    key={c.developer_id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 font-semibold text-indigo-300">
                      {c.developer_id}
                    </td>
                    <td className="py-3 text-slate-300">{c.team}</td>
                    <td className="py-3 text-slate-400 font-sans">{c.role}</td>
                    <td className="py-3 text-right text-slate-300">
                      {c.consecutive_event_pairs}
                    </td>
                    <td className="py-3 text-right text-slate-300">
                      {c.source_change_count}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex rounded bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
                        {c.rapid_source_change_count}
                      </span>
                    </td>
                    <td className="py-3 text-right text-amber-400">
                      {c.long_inactivity_gap_count}
                    </td>
                    <td className="py-3 text-right text-slate-300">
                      {c.average_gap_minutes}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
