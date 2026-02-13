import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '../utils/errors';

export const validate = (schema: z.ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body?: Request['body'];
        params?: Request['params'];
        query?: Request['query'];
      };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params;
      }
      if (parsed.query !== undefined) {
        req.query = parsed.query;
      }

      return next();
    } catch (error) {
      return next(new AppError('Validation error', 400, error));
    }
  };
