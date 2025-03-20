import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const getBoardState: SocketHandler['get:boardState'] =
   (client) => (gameId) => {
      const game = getGame(gameId);
      if (game === null) {
         client.send(
            'server:error',
            'GAME_NOT_FOUND',
            `Failed to find game ${gameId}.`
         );
         logger(
            `failed to get boardState for player ${client.playerId} - game ${gameId} (GAME_NOT_FOUND)`
         );
         return;
      }

      client.send('get:boardState', game.getBoardState(), game.turn);

      logger(
         `player ${
            client.playerId
         } requested boardState - game ${gameId} (role ${client.getCurrentRole()})`
      );
   };
