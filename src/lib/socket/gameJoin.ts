import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { Client } from '@/lib/client/Client';
import type { ServerError, SocketHandler } from '@/types/socket';
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

export const gameJoin: SocketHandler['game:join'] = (client) => (gameId) => {
   const joinGameCallback = (
      error: ServerError | null,
      role: Reversi['Role'],
      status: Exclude<Reversi['GameStatus'], 'complete'>,
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null,
      _gameStart: boolean
   ) => {
      if (error !== null) return handleError(client, gameId, error);

      const opponentId = opponent?.username ?? null;
      client.send('game:join', gameId, role, status, opponentId);
      opponent?.send('game:userJoin', client.username, role);
      observers?.forEach((observer) => {
         if (observer.playerId === client.playerId) return;
         observer.send('game:userJoin', client.username, role);
      });

      logger(`player ${client.playerId} joined game ${gameId} (role: ${role})`);
   };

   gameManager.join(gameId, client, joinGameCallback);
};
