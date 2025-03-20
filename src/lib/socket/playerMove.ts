import { clientManager } from '@/lib/socket/clientManager';
import { gameManager } from '@/lib/game/gameManager';
import type { SocketHandler } from '@/types/socket';

export const playerMove: SocketHandler['player:move'] =
   (client) => (gameId, moveIndex) => {
      gameManager.requestMove(
         client.playerId,
         gameId,
         moveIndex,
         ({ error, boardState }) => {
            if (error)
               client.socket.emit('server:message', 'unable to move', error);
            else if (boardState) return;
            else {
               const clients = gameManager.getParticipants(gameId);
               clientManager.broadcast(clients, 'get:boardState', boardState!);
            }
         }
      );
   };
