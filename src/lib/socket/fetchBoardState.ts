import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { ServerError, SocketHandler } from '@/types/socket';
import type { Reversi } from '@/types/reversi';
import type { Client } from '@/lib/client/Client';

const handleError = (
   client: Client,
   gameId: Reversi['GameId'],
   error: ServerError
) => {
   client.send('server:error', error, `Failed to find game ${gameId}.`);
   logger(`could not fetch board state for game ${gameId} (${error})`);
};

export const fetchBoardState: SocketHandler['fetch:boardState'] =
   (client) => (gameId) => {
      const callback = (
         error: ServerError | null,
         boardState: Reversi['BoardState'],
         turn: Reversi['PlayerRole']
      ) => {
         if (error !== null) return handleError(client, gameId, error);

         client.send('fetch:boardState', boardState, turn);

         const playerId = client.playerId;
         logger(`player ${playerId} requested boardState for game ${gameId}`);
      };

      gameManager.getBoardState(gameId, callback);
   };
