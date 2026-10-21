import React from 'react';
import { Filter, RotateCcw, CheckSquare, Square } from 'lucide-react';

interface FilterBarProps {
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
  selectedDeveloper: string;
  onSelectDeveloper: (dev: string) => void;
  developerList?: string[];
  candidatesOnly?: boolean;
  onToggleCandidatesOnly?: (val: boolean) => void;
  showCandidateToggle?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedTeam,
  onSelectTeam,
  selectedDeveloper,
  onSelectDeveloper,
  developerList = [
    'DEV001', 'DEV002', 'DEV003', 'DEV004', 'DEV005',
    'DEV006', 'DEV007', 'DEV008', 'DEV009', 'DEV010',
  ],
  candidatesOnly = false,
  onToggleCandidatesOnly,
  showCandidateToggle = false,
}) => {
  const isFiltered =
    selectedTeam !== 'All' ||
    selectedDeveloper !== 'All' ||
    (showCandidateToggle && candidatesOnly);

  const handleReset = () => {
    onSelectTeam('All');
    onSelectDeveloper('All');
    if (onToggleCandidatesOnly) {
      onToggleCandidatesOnly(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 backdrop-blur-sm text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span>Filters:</span>
        </div>

        {/* Team Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="team-select" className="text-slate-500 font-mono text-[11px]">
            Team:
          </label>
          <select
            id="team-select"
            value={selectedTeam}
            onChange={(e) => onSelectTeam(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
          >
            <option value="All">All Teams</option>
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
          </select>
        </div>

        {/* Developer Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="dev-select" className="text-slate-500 font-mono text-[11px]">
            Developer:
          </label>
          <select
            id="dev-select"
            value={selectedDeveloper}
            onChange={(e) => onSelectDeveloper(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
          >
            <option value="All">All Developers</option>
            {developerList.map((dev) => (
              <option key={dev} value={dev}>
                {dev}
              </option>
            ))}
          </select>
        </div>

        {/* Candidate Focus Toggle */}
        {showCandidateToggle && onToggleCandidatesOnly && (
          <button
            onClick={() => onToggleCandidatesOnly(!candidatesOnly)}
            className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 transition-colors ${
              candidatesOnly
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            {candidatesOnly ? (
              <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Square className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span className="font-mono text-[11px]">Candidate Focus Only</span>
          </button>
        )}
      </div>

      {isFiltered && (
        <button
          onClick={handleReset}
          className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
