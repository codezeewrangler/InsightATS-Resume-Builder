import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import type { Options as PinoHttpOptions } from 'pino-http';

import { env } from './config/env';
import { logger } from './config/logger';
import { isOriginAllowed, resolveAllowedOrigins } from './config/origins';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

const httpLoggerOptions: PinoHttpOptions = {
  logger: logger as unknown as PinoHttpOptions['logger'],
};

const allowedOrigins = resolveAllowedOrigins();

app.use(pinoHttp(httpLoggerOptions));
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS origin rejected: ${origin ?? 'unknown'}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
