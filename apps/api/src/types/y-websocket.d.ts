declare module 'y-websocket/bin/utils' {
  import { IncomingMessage } from 'http';
  import { WebSocket } from 'ws';
  import * as Y from 'yjs';

  export function setupWSConnection(
    conn: WebSocket,
    req: IncomingMessage,
    options?: { gc?: boolean; docName?: string },
  ): void;

  export function setPersistence(persistence: {
    bindState: (docName: string, doc: Y.Doc) => Promise<void> | void;
    writeState: (docName: string, doc: Y.Doc) => Promise<void> | void;
  }): void;
}
