import { apiRequest } from './apiClient';

export interface FreeTierUsageResponse {
  limits: {
    aiPerDay: number;
    resumesPerUser: number;
    versionsPerResume: number;
    collaboratorsPerResume: number;
  };
  usage: {
    aiUsedToday: number;
    resumesUsed: number;
    versionsUsedForActiveResume?: number;
    collaboratorsUsedForActiveResume?: number;
  };
  resetAtUtc: string;
}

export const usageApi = {
  get: (accessToken: string, resumeId?: string) => {
    const query = resumeId ? `?resumeId=${encodeURIComponent(resumeId)}` : '';
    return apiRequest<FreeTierUsageResponse>(`/usage/free-tier${query}`, { method: 'GET' }, accessToken);
  },
};
