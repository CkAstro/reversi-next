import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { ServerError, SocketHandler } from '@/types/socket';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const handleError = (
   client: Client,
   gameId: Reversi['GameId'],
   error: ServerError
) => {
   client.send('server:error', error, `Failed to join game ${gameId}.`);

   const playerId = client.playerId;
   logger(`failed to add player ${playerId} to game ${gameId} (${error})`);
};

export const gameObserve: SocketHandler['game:observe'] =
   (client) => (gameId) => {
      const callback = (
         error: ServerError | null,
         role: Reversi['Role'],
         status: Exclude<Reversi['GameStatus'], 'complete'>
      ) => {
         if (error !== null) return handleError(client, gameId, error);

         client.send('game:join', gameId, role, status, null);
         client.sendToRoom('game:userJoin', client.username, role);

         const playerId = client.playerId;
         logger(`player ${playerId} joined game ${gameId} (role: ${role})`);
      };

      gameManager.observe(gameId, client, callback);
   };
