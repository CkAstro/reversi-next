import { clientManager } from '@/lib/socket/clientManager';
import { gameCreate } from '@/lib/socket/gameCreate';
import { gameJoin } from '@/lib/socket/gameJoin';
import { gameLeave } from '@/lib/socket/gameLeave';
import { gameObserve } from '@/lib/socket/gameObserve';
import { getBoardState } from '@/lib/socket/getBoardState';
import { getGames } from '@/lib/socket/getGames';
import { playerMove } from '@/lib/socket/playerMove';
import { logger } from '@/lib/utils/logger';
import type { ServerSocket } from '@/types/socket';

export const initConnection = (socket: ServerSocket) => {
   const client = clientManager.registerClient(socket);

   logger(`client ${client.playerId} connected.`);
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

   socket.on('game:join', gameJoin(client));
   socket.on('game:leave', gameLeave(client));
   socket.on('game:create', gameCreate(client));
   socket.on('game:observe', gameObserve(client));

   socket.on('player:move', playerMove(client));

   socket.on('get:games', getGames(client));
   socket.on('get:boardState', getBoardState(client));
};
