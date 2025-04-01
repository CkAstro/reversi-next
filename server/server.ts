import { Server } from 'socket.io';
import { createServer } from 'http';
import { initConnection } from '@/lib/socket/initConnection';
import { logger } from '@/lib/utils/logger';

const httpServer = createServer();
const io = new Server(httpServer, {
   cors: {
      origin: '*',
   },
   path: '/socket.io',
   connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
   },
});

io.on('connection', (socket) => {
   initConnection(io, socket);
});

httpServer.listen(3001, '0.0.0.0', () => {
   logger('WebSocket server running on port 3001');
});
