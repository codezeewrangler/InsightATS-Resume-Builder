import { FreeTierResource } from '../config/freeTier';

export class AppError extends Error {
  statusCode: number;
  details?: unknown;
  code?: string;

  constructor(message: string, statusCode = 500, details?: unknown, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
  }
}

export interface FreeTierLimitDetails {
  resource: FreeTierResource;
  limit: number;
  current: number;
  resetAtUtc?: string;
}

export class FreeTierLimitError extends AppError {
  constructor(message: string, details: FreeTierLimitDetails) {
    super(message, 429, details, 'FREE_TIER_LIMIT_REACHED');
  }
}
