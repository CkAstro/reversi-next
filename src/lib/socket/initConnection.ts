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
   logger(`client ${socket.id} connected.`);
   socket.on('error', (error) => {
      logger(`client ${socket.id} encountered error: ${error.message}`);
      socket.emit(
         'server:message',
         'socket connection encountered an error.',
         error.message
      );
   });

   socket.on('disconnect', (reason) => {
      logger(`client ${socket.id} disconnected with reason: ${reason}`);
   });

   socket.on('game:join', gameJoin(socket));
   socket.on('game:leave', gameLeave(socket));
   socket.on('game:create', gameCreate(socket));
   socket.on('game:observe', gameObserve(socket));

   socket.on('player:move', playerMove(socket));

   socket.on('get:games', getGames(socket));
   socket.on('get:boardState', getBoardState(socket));
};
