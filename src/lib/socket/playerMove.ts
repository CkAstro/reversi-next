import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type {
   AddedGame,
   RemovedGame,
   ServerError,
   ServerIO,
   SocketHandler,
} from '@/types/socket';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

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

const broadcastUpgrade = (
   io: ServerIO,
   gameId: Reversi['GameId'],
   client: Client
) => {
   if (client.game === null) throw new Error('oh no, no game');
   const [playerA, playerB] = client.game.getPlayers();
   const score = client.game.getScore();

   const addedGame: AddedGame = {
      type: 'complete',
      game: {
         gameId,
         playerA: playerA ?? '',
         playerB: playerB ?? '',
         score,
      },
   };

   const removedGame: RemovedGame = {
      type: 'active',
      gameId,
   };

   io.emit('update:lobby', [addedGame], [removedGame]);
};

export const playerMove: SocketHandler['player:move'] =
   (client, io) => (gameId, moveIndex) => {
      const role = client.getCurrentRole();
      if (role === 0 || role === null) return;

      const callback = (
         error: ServerError | null,
         boardState: Reversi['BoardState'],
         turn: Reversi['PlayerRole'],
         winner: Reversi['PlayerRole'] | 0 | null
      ) => {
         if (error === 'INVALID_MOVE')
            return handleInvalidMove(client, error, moveIndex, gameId);
         if (error === 'GAME_NOT_ACTIVE')
            return handleInactiveGame(client, error, moveIndex, gameId);
         if (error === 'SERVER_ERROR')
            return handleGameNotFound(client, error, moveIndex, gameId);
         if (error) return handleMiscError(client, error, moveIndex, gameId);

         if (winner === null) {
            io.to(gameId).emit('fetch:boardState', boardState, turn);
         } else {
            io.to(gameId).emit('game:end', boardState, winner);
            broadcastUpgrade(io, gameId, client);
         }
      };

      gameManager.requestMove(gameId, role, moveIndex, callback);
   };
