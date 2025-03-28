import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameJoin: SocketHandler['game:join'] = (client) => (gameId) => {
   gameManager.join(gameId, client, (error, role, opponent, observers) => {
      if (error !== null) {
         client.send('server:error', error, `Failed to join game ${gameId}.`);
         logger(
            `failed to add player ${client.playerId} to game ${gameId} (${error})`
         );
         return;
      }

      client.send('game:join', gameId, role, client.opponent?.username);
      opponent?.send('game:playerJoin', client.username, role);
      observers?.forEach((observer) => {
         if (observer.playerId === client.playerId) return;
         observer.send('game:playerJoin', client.username, role);
      });

      logger(`player ${client.playerId} joined game ${gameId} (role: ${role})`);
   });
};
