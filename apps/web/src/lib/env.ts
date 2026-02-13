import { z } from 'zod';

const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const toApiBaseUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('VITE_API_BASE_URL is empty');
  }

  if (trimmed.startsWith('/')) {
    return removeTrailingSlash(trimmed);
  }

  return removeTrailingSlash(new URL(trimmed).toString());
};

const httpToWebSocket = (value: string) => value.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');

const deriveWsBaseUrl = (apiBaseUrl: string) => {
  if (apiBaseUrl.startsWith('/')) {
    if (typeof window === 'undefined') {
      return 'ws://localhost:4001';
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }

  const url = new URL(apiBaseUrl);
  const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  const path = url.pathname.endsWith('/api')
    ? url.pathname.slice(0, -4) || '/'
    : url.pathname || '/';
  const normalizedPath = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${wsProtocol}//${url.host}${normalizedPath}`;
};

const toWsBaseUrl = (value: string | undefined, apiBaseUrl: string) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return deriveWsBaseUrl(apiBaseUrl);
  }

  const withWsProtocol =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? httpToWebSocket(trimmed)
      : trimmed;

  return removeTrailingSlash(new URL(withWsProtocol).toString());
};

const apiBaseUrlDefault = import.meta.env.DEV ? 'http://localhost:4000/api' : '/api';
const apiBaseUrl = toApiBaseUrl(import.meta.env.VITE_API_BASE_URL ?? apiBaseUrlDefault);
const wsBaseUrl = toWsBaseUrl(import.meta.env.VITE_WS_URL, apiBaseUrl);

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1),
  VITE_WS_URL: z.string().url(),
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: apiBaseUrl,
  VITE_WS_URL: wsBaseUrl,
});
