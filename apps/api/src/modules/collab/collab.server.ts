import { WebSocketServer } from 'ws';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import * as Y from 'yjs';

import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { isOriginAllowed, resolveAllowedOrigins } from '../../config/origins';
import { prisma } from '../../db/prisma';
import { verifyAccessToken } from '../../utils/jwt';

const loadDocState = async (docName: string, ydoc: Y.Doc) => {
  const resume = await prisma.resume.findUnique({
    where: { id: docName },
    select: { collabState: true },
  });

  if (resume?.collabState) {
    Y.applyUpdate(ydoc, resume.collabState);
  }
};

const storeDocState = async (docName: string, ydoc: Y.Doc) => {
  const update = Buffer.from(Y.encodeStateAsUpdate(ydoc));
  try {
    await prisma.resume.update({
      where: { id: docName },
      data: { collabState: update },
    });
  } catch (error) {
    logger.warn({ error, docName }, 'Failed to persist collaborative state');
  }
};

export const setupCollabServer = () => {
  const allowedOrigins = resolveAllowedOrigins();

  setPersistence({
    bindState: loadDocState,
    writeState: storeDocState,
  });

  const wss = new WebSocketServer({ port: env.COLLAB_PORT });

  wss.on('connection', async (conn, req) => {
    try {
      const originHeader = req.headers.origin;
      if (!isOriginAllowed(originHeader, allowedOrigins)) {
        conn.close(1008, 'Origin not allowed');
        return;
      }

      const url = new URL(req.url ?? '/', 'http://localhost');
      const resumeId = url.pathname.replace(/^\//, '');
      const token = url.searchParams.get('token');

      if (!resumeId || !token) {
        conn.close(1008, 'Missing resume or token');
        return;
      }

      const payload = verifyAccessToken(token);
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          OR: [
            { ownerId: payload.sub },
            { collaborators: { some: { userId: payload.sub } } },
          ],
        },
        select: { id: true },
      });

      if (!resume) {
        conn.close(1008, 'Forbidden');
        return;
      }

      (req as { url?: string }).url = `/${resumeId}`;
      setupWSConnection(conn, req, { gc: true });
    } catch (error) {
      logger.warn({ error }, 'WebSocket authentication failed');
      conn.close(1008, 'Unauthorized');
    }
  });

  logger.info(`Collaboration WebSocket listening on port ${env.COLLAB_PORT}`);
};
