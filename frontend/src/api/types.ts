export interface DeveloperActivity {
  developer_id: string;
  team: string;
  role: string;
  total_events: number;
  total_recorded_duration_minutes: number;
  average_event_duration_minutes: number;
  unique_sources: number;
}

export interface SourceActivity {
  source: 'GitHub' | 'Slack' | 'Jira' | 'IDE' | string;
  total_events: number;
  total_recorded_duration_minutes: number;
  average_event_duration_minutes: number;
}

export interface TeamActivity {
  team: string;
  total_events: number;
  developer_count: number;
  unique_sources: number;
  total_recorded_duration_minutes: number;
  average_event_duration_minutes: number;
  events_per_developer: number;
}

export interface TeamFlow {
  team: string;
  consecutive_event_pairs: number;
  source_change_count: number;
  source_change_rate_percent: number;
}

export interface IDESession {
  developer_id: string;
  team: string;
  role: string;
  session_number: number;
  ide_event_count: number;
  session_start: string;
  session_end: string;
  sum_recorded_event_duration_minutes: number;
  elapsed_minutes: number;
  candidate_focus_session: boolean;
}

export interface ContextSwitch {
  developer_id: string;
  team: string;
  role: string;
  consecutive_event_pairs: number;
  source_change_count: number;
  rapid_source_change_count: number;
  long_inactivity_gap_count: number;
  average_gap_minutes: number;
}

export interface HealthStatus {
  status: string;
  service: string;
}

export interface PaginatedResponse<T> {
  count: number;
  limit: number;
  offset: number;
  data: T[];
}

export interface ListResponse<T> {
  count: number;
  data: T[];
}
