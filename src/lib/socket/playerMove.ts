import { gameManager } from '@/lib/game/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const playerMove: SocketHandler['player:move'] =
   (client) => (gameId, moveIndex) => {
      const role = client.getCurrentRole();
      if (role === 0 || role === null) return;

      gameManager.requestMove(
         gameId,
         role,
         moveIndex,
         (error, boardState, turn, clients) => {
            if (error !== null) {
               const message =
                  error === 'INVALID_MOVE'
                     ? 'Move not allowed.'
                     : `Failed to find game ${gameId}.`;
               client.send('server:error', error, message);
               logger(
                  error === 'INVALID_MOVE'
                     ? `rejected move ${moveIndex} from player ${client.playerId} - game ${gameId} (${error})`
                     : `failed to apply move from player ${client.playerId} - game ${gameId} (${error})`
               );
               return;
            }

            clients.forEach((participant) => {
               participant.send('get:boardState', boardState, turn);
            });
         }
      );
   };
