import { apiRequest } from './apiClient';

export interface ResumeSummary {
  id: string;
  title: string;
  updatedAt: string;
  ownerId: string;
}

export interface ResumeDetails {
  id: string;
  title: string;
  content?: unknown;
  updatedAt: string;
  ownerId: string;
}

export interface ResumeVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdById?: string | null;
}

export interface Collaborator {
  id: string;
  role: 'owner' | 'editor' | 'viewer';
  user: { id: string; email: string; fullName?: string | null };
}

export const resumeApi = {
  list: (accessToken: string) =>
    apiRequest<{ resumes: ResumeSummary[] }>('/resumes', { method: 'GET' }, accessToken),
  create: (accessToken: string, payload: { title?: string; content?: unknown }) =>
    apiRequest<{ resume: ResumeDetails }>('/resumes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, accessToken),
  get: (accessToken: string, id: string) =>
    apiRequest<{ resume: ResumeDetails; role: 'owner' | 'editor' | 'viewer' }>(
      `/resumes/${id}`,
      { method: 'GET' },
      accessToken,
    ),
  update: (
    accessToken: string,
    id: string,
    payload: { title?: string; content?: unknown; createVersion?: boolean },
  ) =>
    apiRequest<{ resume: ResumeDetails }>(
      `/resumes/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      accessToken,
    ),
  listVersions: (accessToken: string, id: string) =>
    apiRequest<{ versions: ResumeVersion[] }>(`/resumes/${id}/versions`, { method: 'GET' }, accessToken),
  createVersion: (accessToken: string, id: string, content?: unknown) =>
    apiRequest<{ version: ResumeVersion }>(
      `/resumes/${id}/versions`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
      accessToken,
    ),
  restoreVersion: (accessToken: string, id: string, versionId: string) =>
    apiRequest<{ resume: ResumeDetails }>(
      `/resumes/${id}/versions/${versionId}/restore`,
      {
        method: 'POST',
      },
      accessToken,
    ),
  listCollaborators: (accessToken: string, id: string) =>
    apiRequest<{ collaborators: Collaborator[] }>(
      `/resumes/${id}/collaborators`,
      { method: 'GET' },
      accessToken,
    ),
  addCollaborator: (
    accessToken: string,
    id: string,
    payload: { email: string; role: 'editor' | 'viewer' },
  ) =>
    apiRequest<{ collaborator: Collaborator }>(
      `/resumes/${id}/collaborators`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      accessToken,
    ),
};
