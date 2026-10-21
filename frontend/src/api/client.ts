import {
  DeveloperActivity,
  SourceActivity,
  TeamActivity,
  TeamFlow,
  IDESession,
  ContextSwitch,
  HealthStatus,
  PaginatedResponse,
  ListResponse,
} from './types';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const errorJson = await response.json();
          if (errorJson.detail) {
            errorDetail = typeof errorJson.detail === 'string'
              ? errorJson.detail
              : JSON.stringify(errorJson.detail);
          }
        } catch {
          // Response wasn't JSON
        }
        throw new Error(`API Error (${response.status}): ${errorDetail}`);
      }

      return await response.json();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(`Failed to reach CogniStream API at ${url}`);
    }
  }

  async checkHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async getDevelopers(
    team?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<PaginatedResponse<DeveloperActivity>> {
    const params = new URLSearchParams();
    if (team && team !== 'All') params.append('team', team);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return this.request<PaginatedResponse<DeveloperActivity>>(
      `/developers?${params.toString()}`
    );
  }

  async getSources(): Promise<ListResponse<SourceActivity>> {
    return this.request<ListResponse<SourceActivity>>('/sources');
  }

  async getTeams(): Promise<ListResponse<TeamActivity>> {
    return this.request<ListResponse<TeamActivity>>('/teams');
  }

  async getTeamFlow(): Promise<ListResponse<TeamFlow>> {
    return this.request<ListResponse<TeamFlow>>('/team-flow');
  }

  async getSessions(
    developerId?: string,
    candidatesOnly: boolean = false,
    limit: number = 500,
    offset: number = 0
  ): Promise<PaginatedResponse<IDESession>> {
    const params = new URLSearchParams();
    if (developerId && developerId !== 'All') {
      params.append('developer_id', developerId);
    }
    if (candidatesOnly) {
      params.append('candidates_only', 'true');
    }
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return this.request<PaginatedResponse<IDESession>>(
      `/sessions?${params.toString()}`
    );
  }

  async getContextSwitches(
    developerId?: string,
    team?: string
  ): Promise<ListResponse<ContextSwitch>> {
    const params = new URLSearchParams();
    if (developerId && developerId !== 'All') {
      params.append('developer_id', developerId);
    }
    if (team && team !== 'All') {
      params.append('team', team);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<ListResponse<ContextSwitch>>(`/context-switches${query}`);
  }
}

export const api = new ApiClient();
