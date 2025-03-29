import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameObserve: SocketHandler['game:observe'] =
   (client) => (gameId) => {
      gameManager.observe(gameId, client, (error, role, _, observers) => {
         if (error !== null) {
            client.send('server:error', error, `Failed to join game ${gameId}`);
            logger(
               `failed to add player ${client.playerId} to game ${gameId} (GAME_NOT_FOUND)`
            );
            return;
         }

         client.send('game:join', gameId, role, null);
         observers?.forEach((observer) => {
            if (observer.playerId === client.playerId) return;
            observer.send('game:userJoin', client.username, role);
         });

         logger(
            `player ${client.playerId} joined game ${gameId} (role: ${role})`
         );
      });
   };
