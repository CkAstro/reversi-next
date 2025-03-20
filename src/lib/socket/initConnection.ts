import { Client } from '@/lib/client/Client';
import { gameCreate } from '@/lib/socket/gameCreate';
import { gameJoin } from '@/lib/socket/gameJoin';
import { sessions } from '@/lib/socket/sessionStore';
import { logger } from '@/lib/utils/logger';
import type { ServerSocket } from '@/types/socket';

export const initConnection = (socket: ServerSocket) => {
   // fetch playerId based on auth information, then create client
   const { key: authKey, username = '' } = socket.handshake.auth;
   const playerId = sessions.get(authKey, username);
   const client = new Client(playerId, socket);
   logger(`client ${playerId} connected (user: ${username})`);

   // set up socket stuff
   socket.on('error', (error) => {
      logger(`client ${client.playerId} encountered error: ${error.message}`);
      client.send('server:error', 'SOCKET_ERROR', error.message);
   });

   socket.on('disconnect', (reason) => {
      logger(`client ${client.playerId} disconnected with reason: ${reason}`);
   });

   // set up event actions
   socket.on('game:join', gameJoin(client));
   socket.on('game:leave', () => undefined);
   socket.on('game:create', gameCreate(client));
   socket.on('game:observe', () => undefined);
   socket.on('game:navigate', () => undefined);

   socket.on('player:move', () => undefined);

   socket.on('get:games', () => undefined);
   socket.on('get:boardState', () => undefined);
};
