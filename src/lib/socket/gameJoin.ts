import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameJoin: SocketHandler['game:join'] = (client) => (gameId) => {
   const game = getGame(gameId);
   if (game === null) {
      client.send(
         'server:error',
         'GAME_NOT_FOUND',
         `Failed to join game ${gameId}.`
      );
      logger(
         `failed to add player ${client.playerId} to game ${gameId} (GAME_NOT_FOUND)`
      );
      return;
   }

   game.addPlayer(client);
   const role = client.getCurrentRole();

   client.send('game:join', gameId, role, client.opponent?.username);
   client.opponent?.send('game:playerJoin', client.username, role);
   game.getObservers().forEach((observer) => {
      observer.send('game:playerJoin', client.username, role);
   });

   logger(`player ${client.playerId} joined game ${gameId} (role: ${role})`);
};
