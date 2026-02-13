import { env } from './env';

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '');

const localDevOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

export const resolveAllowedOrigins = () => {
  const configuredOrigins = env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const merged =
    env.NODE_ENV === 'production'
      ? configuredOrigins
      : [...configuredOrigins, ...localDevOrigins];

  return Array.from(new Set(merged.map(normalizeOrigin)));
};

export const isOriginAllowed = (origin: string | undefined, allowedOrigins: string[]) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes('*')) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
};
