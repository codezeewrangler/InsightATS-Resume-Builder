import { apiRequest } from './apiClient';

export interface AuthResponse {
  user: { id: string; email: string; fullName?: string | null };
  accessToken: string;
}

export const authApi = {
  register: (payload: { email: string; password: string; fullName?: string }) =>
    apiRequest<{ user: { id: string; email: string; fullName?: string | null } }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),
  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  refresh: () =>
    apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  logout: () =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  me: (accessToken: string) =>
    apiRequest<{ user: { id: string; email: string; fullName?: string | null } }>(
      '/auth/me',
      {
        method: 'GET',
      },
      accessToken,
    ),
};
