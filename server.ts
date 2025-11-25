/**
 * Custom Server with Socket.io
 * =============================
 * Run with: npx ts-node server.ts
 * Or: npm run dev:socket
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeSocket } from './lib/socket/server';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  // Initialize Socket.io
  const io = initializeSocket(httpServer);

  console.log('🔌 Socket.io initialized');

  httpServer.listen(port, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════╗
    ║                                                      ║
    ║   🚌 BLR Transit Server                              ║
    ║                                                      ║
    ║   > Ready on http://${hostname}:${port}                   ║
    ║   > WebSocket: ws://${hostname}:${port}                   ║
    ║   > Mode: ${dev ? 'Development' : 'Production'}                           ║
    ║                                                      ║
    ╚══════════════════════════════════════════════════════╝
    `);
  });
});
