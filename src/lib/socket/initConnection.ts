import { Client } from '@/lib/client/Client';
import { logger } from '@/lib/utils/logger';
import { gameLeave } from './gameLeave';
import { gameObserve } from './gameObserve';
import { gameCreate } from './gameCreate';
import { gameJoin } from './gameJoin';
import { playerMove } from './playerMove';
import { fetchLobby } from './fetchLobby';
import { fetchBoardState } from './fetchBoardState';
import { setUsername } from './setUsername';
import { getSession, verifyUsername } from '@/lib/redis/sessions';
import type { ServerSocket, ServerIO } from '@/types/socket';

export const initConnection = async (io: ServerIO, socket: ServerSocket) => {
   // fetch playerId based on auth information, then create client
   const { key: authKey, username = '' } = socket.handshake.auth;
   const verifiedUser =
      username === '' || (await verifyUsername(username, authKey));

   if (!verifiedUser)
      return socket.emit(
         'server:error',
         'INVALID_USERNAME',
         'user:key mismatch.'
      );

   const playerId = await getSession(authKey, username);
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
   socket.on('game:join', gameJoin(client, io));
   socket.on('game:leave', gameLeave(client));
   socket.on('game:create', gameCreate(client, io));
   socket.on('game:observe', gameObserve(client));
   socket.on('game:replay', () => undefined);

   socket.on('player:move', playerMove(client, io));
   socket.on('player:chat', () => undefined);

   socket.on('fetch:lobby', fetchLobby(client));
   socket.on('fetch:chat', () => undefined);
   socket.on('fetch:boardState', fetchBoardState(client));

   socket.on('set:username', setUsername(client));
};
