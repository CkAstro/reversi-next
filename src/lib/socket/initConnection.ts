// import { Client } from '@/lib/client/Client';
import { clientManager } from '@/lib/socket/clientManager';
import { gameCreate } from '@/lib/socket/gameCreate';
import { gameJoin } from '@/lib/socket/gameJoin';
import { gameLeave } from '@/lib/socket/gameLeave';
import { gameNavigate } from '@/lib/socket/gameNavigate';
import { gameObserve } from '@/lib/socket/gameObserve';
import { getBoardState } from '@/lib/socket/getBoardState';
import { getGames } from '@/lib/socket/getGames';
import { playerMove } from '@/lib/socket/playerMove';
import { sessions } from '@/lib/socket/sessionStore';
import { logger } from '@/lib/utils/logger';
import type { ServerSocket } from '@/types/socket';

export const initConnection = (socket: ServerSocket) => {
   // fetch playerId based on auth information, then create client
   const { key: authKey, username = '' } = socket.handshake.auth;
   const playerId = sessions.get(authKey, username);
   // const client = new Client(playerId, socket);

   const client = clientManager.initClient(socket);
   client.playerId = playerId;
   logger(`client ${client.playerId} connected.`);

   // set up basic stuff
   socket.on('error', (error) => {
      logger(`client ${client.playerId} encountered error: ${error.message}`);
      socket.emit(
         'server:message',
         'socket connection encountered an error.',
         error.message
      );
   });

   socket.on('disconnect', (reason) => {
      logger(`client ${client.playerId} disconnected with reason: ${reason}`);
   });

   // set up event actions
   socket.on('game:join', gameJoin(client));
   socket.on('game:leave', gameLeave(client));
   socket.on('game:create', gameCreate(client));
   socket.on('game:observe', gameObserve(client));
   socket.on('game:navigate', gameNavigate(client));

   socket.on('player:move', playerMove(client));

   socket.on('get:games', getGames(client));
   socket.on('get:boardState', getBoardState(client));
};
