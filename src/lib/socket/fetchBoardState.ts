import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const fetchBoardState: SocketHandler['fetch:boardState'] =
   (client) => (gameId) => {
      gameManager.getBoardState(gameId, (error, boardState, turn) => {
         if (error !== null) {
            client.send(
               'server:error',
               error,
               `Failed to find game ${gameId}.`
            );
            return;
         }

         client.send('fetch:boardState', boardState, turn);
         logger(
            `player ${
               client.playerId
            } requested boardState - game ${gameId} (role ${client.getCurrentRole()})`
         );
      });
   };
