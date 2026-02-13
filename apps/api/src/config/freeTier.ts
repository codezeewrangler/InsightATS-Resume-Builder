export const FREE_TIER_LIMITS = {
  aiPerDay: 10,
  resumesPerUser: 3,
  versionsPerResume: 20,
  collaboratorsPerResume: 2,
} as const;

export type FreeTierResource =
  | 'aiAnalysis'
  | 'resumes'
  | 'versions'
  | 'collaborators';

export const getUtcDayStart = (value = new Date()) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));

export const getNextUtcReset = (value = new Date()) => {
  const start = getUtcDayStart(value);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
};

