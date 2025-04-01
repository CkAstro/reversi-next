import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler, ServerError } from '@/types/socket';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const handleError = (
   client: Client,
   gameId: Reversi['GameId'],
   error: ServerError
) => {
   client.send('server:error', error, `Failed to leave game ${gameId}.`);

   const playerId = client.playerId;
   logger(`failed to remove player ${playerId} from game ${gameId} (${error})`);
};

export const gameLeave: SocketHandler['game:leave'] = (client) => (gameId) => {
   const callback = (error: ServerError | null, role: Reversi['Role']) => {
      if (error !== null) return handleError(client, gameId, error);

      client.send('game:leave', '/games');
      client.sendToRoom('game:userLeave', client.username, role);

      const playerId = client.playerId;
      logger(`player ${playerId} left game ${gameId} (role: ${role})`);
   };

   gameManager.leave(gameId, client.playerId, callback);
};
