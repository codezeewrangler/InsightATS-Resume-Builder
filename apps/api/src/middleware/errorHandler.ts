import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { AppError } from '../utils/errors';
import { logger } from '../config/logger';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn({ err }, 'Handled application error');
    if (err.code === 'FREE_TIER_LIMIT_REACHED' && err.details && typeof err.details === 'object') {
      return res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
        ...(err.details as Record<string, unknown>),
      });
    }

    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error({ err }, 'Database initialization error');
    return res.status(503).json({
      error: 'Database is unavailable. Start PostgreSQL and retry.',
      code: 'DATABASE_UNAVAILABLE',
    });
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ error: 'Internal server error' });
};
