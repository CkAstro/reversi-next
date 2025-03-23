import { Client } from '@/lib/client/Client';
import { logger } from '@/lib/utils/logger';
import { gameLeave } from './gameLeave';
import { gameObserve } from './gameObserve';
import { gameCreate } from './gameCreate';
import { gameJoin } from './gameJoin';
import { sessions } from './sessionStore';
import { playerMove } from './playerMove';
import { getBoardState } from './getBoardState';
import { getGames } from './getGames';
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
   socket.on('game:leave', gameLeave(client));
   socket.on('game:create', gameCreate(client));
   socket.on('game:observe', gameObserve(client));

   socket.on('player:move', playerMove(client));

   socket.on('get:games', getGames(client));
   socket.on('get:boardState', getBoardState(client));
};
