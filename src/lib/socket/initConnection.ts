import { Client } from '@/lib/client/Client';
import { gameLeave } from '@/lib/socket/gameLeave';
import { gameObserve } from '@/lib/socket/gameObserve';
import { gameCreate } from '@/lib/socket/gameCreate';
import { gameJoin } from '@/lib/socket/gameJoin';
import { sessions } from '@/lib/socket/sessionStore';
import { logger } from '@/lib/utils/logger';
import type { ServerSocket } from '@/types/socket';
import { playerMove } from '@/lib/socket/playerMove';
import { getBoardState } from '@/lib/socket.old/getBoardState';
import { getGames } from '@/lib/socket/getGames';

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
