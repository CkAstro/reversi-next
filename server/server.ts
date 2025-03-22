import { Server } from 'socket.io';
import { initConnection } from '@/lib/socket/initConnection';
import { logger } from '@/lib/utils/logger';

const io = new Server(3001, {
   cors: {
      origin: '*',
   },
   connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
   },
});

io.on('connection', (socket) => {
   initConnection(socket);
});

logger('socket server running on ws://localhost:3001');
