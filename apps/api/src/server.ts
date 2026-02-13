import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { setupCollabServer } from './modules/collab/collab.server';

const httpServer = createServer(app);

if (!env.ENABLE_API_SERVER && !env.ENABLE_COLLAB_SERVER) {
  logger.error('Both ENABLE_API_SERVER and ENABLE_COLLAB_SERVER are disabled. Nothing to start.');
  process.exit(1);
}

if (env.ENABLE_API_SERVER) {
  httpServer.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });
}

if (env.ENABLE_COLLAB_SERVER) {
  setupCollabServer();
}
