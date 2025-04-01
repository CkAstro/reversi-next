import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { Client } from '@/lib/client/Client';
import type {
   AddedGame,
   RemovedGame,
   ServerError,
   ServerIO,
   SocketHandler,
} from '@/types/socket';
import type { Reversi } from '@/types/reversi';

const handleError = (
   client: Client,
   gameId: Reversi['GameId'],
   error: ServerError
) => {
   client.send('server:error', error, `Failed to join game ${gameId}`);

   const playerId = client.playerId;
   logger(`failed to add player ${playerId} to game ${gameId} (${error})`);
};

const broadcastUpgrade = (
   io: ServerIO,
   gameId: Reversi['GameId'],
   client: Client,
   opponent: Client | null
) => {
   const role = client.getCurrentRole();
   const opponentName = opponent?.username ?? '';

   const playerA = role === 1 ? client.username : opponentName;
   const playerB = role === 1 ? opponentName : client.username;
   const addedGame: AddedGame = {
      type: 'active',
      game: { gameId, playerA, playerB, observerCount: 0 },
   };
   const removedGame: RemovedGame = {
      type: 'pending',
      gameId,
   };

   io.emit('update:lobby', [addedGame], [removedGame]);
};

export const gameJoin: SocketHandler['game:join'] =
   (client, io) => (gameId) => {
      const joinGameCallback = (
         error: ServerError | null,
         role: Reversi['Role'],
         status: Exclude<Reversi['GameStatus'], 'complete'>,
         opponent: Client | null,
         gameStart: boolean
      ) => {
         if (error !== null) return handleError(client, gameId, error);

         const opponentId = opponent?.username ?? null;
         client.send('game:join', gameId, role, status, opponentId);
         client.sendToRoom('game:userJoin', client.username, role);
         if (gameStart) broadcastUpgrade(io, gameId, client, opponent);

         const playerId = client.playerId;
         logger(`player ${playerId} joined game ${gameId} (role: ${role})`);
      };

      gameManager.join(gameId, client, joinGameCallback);
   };
