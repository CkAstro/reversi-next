import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { ServerError, SocketHandler } from '@/types/socket';
import type { Client } from '@/lib/client/Client';

type ErrorHandler = (
   client: Client,
   error: ServerError,
   moveIndex: number,
   gameId: string
) => void;

const handleInvalidMove: ErrorHandler = (client, error, move, gameId) => {
   client.send('server:error', error, 'Move not allowed.');
   return logger(
      `rejected move ${move} from player ${client.playerId} - game ${gameId} (${error})`
   );
};

const handleInactiveGame: ErrorHandler = (client, error, move, gameId) => {
   client.send('server:error', error, 'Cannot move - game is not active.');
   return logger(
      `rejected move ${move} from player ${client.playerId} - game ${gameId} (${error})`
   );
};

const handleGameNotFound: ErrorHandler = (client, error, move, gameId) => {
   client.send('server:error', error, 'Failed to find game.');
   return logger(
      `failed to apply: move ${move}, player ${client.playerId}, game ${gameId} (${error})`
   );
};

const handleMiscError: ErrorHandler = (client, error, move, gameId) => {
   return logger(
      `unknown error: move ${move} by player ${client.playerId} in game ${gameId} (${error})`
   );
};

export const playerMove: SocketHandler['player:move'] =
   (client) => (gameId, moveIndex) => {
      const role = client.getCurrentRole();
      if (role === 0 || role === null) return;

      gameManager.requestMove(
         gameId,
         role,
         moveIndex,
         (error, boardState, turn, clients, winner) => {
            if (error === 'INVALID_MOVE')
               return handleInvalidMove(client, error, moveIndex, gameId);
            if (error === 'GAME_NOT_ACTIVE')
               return handleInactiveGame(client, error, moveIndex, gameId);
            if (error === 'SERVER_ERROR')
               return handleGameNotFound(client, error, moveIndex, gameId);
            if (error) return handleMiscError(client, error, moveIndex, gameId);

            if (winner === null) {
               clients.forEach((participant) => {
                  participant.send('get:boardState', boardState, turn);
               });
            } else {
               clients.forEach((participant) => {
                  participant.send('game:end', boardState, winner);
               });
            }
         }
      );
   };
