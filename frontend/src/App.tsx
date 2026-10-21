import { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import {
  DeveloperActivity,
  SourceActivity,
  TeamActivity,
  TeamFlow,
  IDESession,
  ContextSwitch,
} from './api/types';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorAlert } from './components/ErrorAlert';
import { OverviewView } from './views/OverviewView';
import { ActivityView } from './views/ActivityView';
import { TeamView } from './views/TeamView';
import { FlowSessionsView } from './views/FlowSessionsView';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Global Filter State
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('All');
  const [candidatesOnly, setCandidatesOnly] = useState<boolean>(false);

  // Data State
  const [developers, setDevelopers] = useState<DeveloperActivity[]>([]);
  const [sources, setSources] = useState<SourceActivity[]>([]);
  const [teams, setTeams] = useState<TeamActivity[]>([]);
  const [teamFlow, setTeamFlow] = useState<TeamFlow[]>([]);
  const [sessions, setSessions] = useState<IDESession[]>([]);
  const [contextSwitches, setContextSwitches] = useState<ContextSwitch[]>([]);

  // Connectivity & Loading State
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      // Step 1: Check health
      try {
        await api.checkHealth();
        setIsApiOnline(true);
      } catch (healthErr) {
        setIsApiOnline(false);
        throw healthErr;
      }

      // Step 2: Fetch all analytics concurrently
      const [
        devsRes,
        sourcesRes,
        teamsRes,
        teamFlowRes,
        sessionsRes,
        switchesRes,
      ] = await Promise.all([
        api.getDevelopers(),
        api.getSources(),
        api.getTeams(),
        api.getTeamFlow(),
        api.getSessions(),
        api.getContextSwitches(),
      ]);

      setDevelopers(devsRes.data || []);
      setSources(sourcesRes.data || []);
      setTeams(teamsRes.data || []);
      setTeamFlow(teamFlowRes.data || []);
      setSessions(sessionsRes.data || []);
      setContextSwitches(switchesRes.data || []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to connect to the CogniStream analytics service.';
      setError(msg);
      setIsApiOnline(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          onOpenMobileNav={() => setIsOpenMobile(true)}
          isApiOnline={isApiOnline}
          onRefresh={() => fetchData(true)}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {error && (
            <ErrorAlert
              message={error}
              onRetry={() => fetchData(false)}
            />
          )}

          {isLoading ? (
            <LoadingSkeleton rows={5} />
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  developers={developers}
                  sources={sources}
                  teams={teams}
                  teamFlow={teamFlow}
                  contextSwitches={contextSwitches}
                  sessions={sessions}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'activity' && (
                <ActivityView
                  sources={sources}
                  developers={developers}
                />
              )}

              {activeTab === 'teams' && (
                <TeamView
                  teams={teams}
                  teamFlow={teamFlow}
                  developers={developers}
                />
              )}

              {activeTab === 'flow' && (
                <FlowSessionsView
                  sessions={sessions}
                  contextSwitches={contextSwitches}
                  selectedTeam={selectedTeam}
                  onSelectTeam={setSelectedTeam}
                  selectedDeveloper={selectedDeveloper}
                  onSelectDeveloper={setSelectedDeveloper}
                  candidatesOnly={candidatesOnly}
                  onToggleCandidatesOnly={setCandidatesOnly}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
