import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameObserve: SocketHandler['game:observe'] =
   (client) => (gameId) => {
      const game = getGame(gameId);
      if (game === null) {
         client.send(
            'server:error',
            'GAME_NOT_FOUND',
            `Failed to join game ${gameId}.`
         );
         logger(
            `failed to add player ${client.playerId} to game ${gameId} (GAME_NOT_FOUND)`
         );
         return;
      }

      game.addObserver(client);

      client.send('game:join', gameId, 0);
      client.opponent?.send('game:playerJoin', client.username, 0);
      game.getObservers().forEach((observer) => {
         observer.send('game:playerJoin', client.username, 0);
      });

      logger(`player ${client.playerId} joined game ${gameId} (role: 0)`);
   };
