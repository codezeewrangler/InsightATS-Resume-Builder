import { env } from './env';

export class ApiError extends Error {
  status: number;
  details?: unknown;
  code?: string;
  resource?: string;
  limit?: number;
  current?: number;
  resetAtUtc?: string;

  constructor(
    message: string,
    status: number,
    details?: unknown,
    meta?: {
      code?: string;
      resource?: string;
      limit?: number;
      current?: number;
      resetAtUtc?: string;
    },
  ) {
    super(message);
    this.status = status;
    this.details = details;
    this.code = meta?.code;
    this.resource = meta?.resource;
    this.limit = meta?.limit;
    this.current = meta?.current;
    this.resetAtUtc = meta?.resetAtUtc;
  }
}

const REQUEST_TIMEOUT_MS = 15000;

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> => {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${env.VITE_API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. Please check your API server and try again.',
        504,
        { path },
      );
    }

    throw new ApiError(
      `Cannot reach API (${env.VITE_API_BASE_URL}). Start backend server and verify CORS/API URL.`,
      0,
      error,
    );
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    let details: unknown = undefined;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }

    const serverDetails =
      details && typeof details === 'object' ? (details as Record<string, unknown>) : null;

    const errorMessage =
      typeof serverDetails?.error === 'string'
        ? serverDetails.error
        : `Request failed (${response.status})`;

    throw new ApiError(errorMessage, response.status, details, {
      code: typeof serverDetails?.code === 'string' ? serverDetails.code : undefined,
      resource: typeof serverDetails?.resource === 'string' ? serverDetails.resource : undefined,
      limit: typeof serverDetails?.limit === 'number' ? serverDetails.limit : undefined,
      current: typeof serverDetails?.current === 'number' ? serverDetails.current : undefined,
      resetAtUtc:
        typeof serverDetails?.resetAtUtc === 'string' ? serverDetails.resetAtUtc : undefined,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
