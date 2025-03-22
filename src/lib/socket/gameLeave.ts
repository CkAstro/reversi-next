import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameLeave: SocketHandler['game:leave'] = (client) => (gameId) => {
   gameManager.leave(
      gameId,
      client.playerId,
      (error, role, opponent, observers) => {
         if (error !== null) {
            client.send(
               'server:error',
               error,
               `Failed to leave game ${gameId}.`
            );
            logger(
               `failed to remove player ${client.playerId} from game ${gameId} (${error})`
            );
            return;
         }

         client.send('game:leave', '/games');
         opponent?.send('game:playerLeave', client.username, role);
         observers?.forEach((observer) => {
            if (observer.playerId === client.playerId) return;
            observer.send('game:playerLeave', client.username, role);
         });

         logger(
            `player ${client.playerId} left game ${gameId} (role: ${role})`
         );
      }
   );
};
