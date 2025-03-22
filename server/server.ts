import { Server } from 'socket.io';
import { initConnection } from '@/lib/socket/initConnection';
import { logger } from '@/lib/utils/logger';
import path from 'path';
import dotenv from 'dotenv';

// use the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (process.env.DEBUG === 'true') console.log('running in DEBUG mode');

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
   if (process.env.DEBUG === 'true')
      socket.use((packet, next) => {
         console.log('INCOMING : ', packet, 'from id', socket.id);
         next();
      });

   initConnection(socket);
});

logger('socket server running on ws://localhost:3001');
