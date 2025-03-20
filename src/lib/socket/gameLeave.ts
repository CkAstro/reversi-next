import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameLeave: SocketHandler['game:leave'] = (client) => (gameId) => {
   const game = getGame(gameId);
   if (game === null) {
      client.send(
         'server:error',
         'GAME_NOT_FOUND',
         `Failed to leave game ${gameId}.`
      );
      logger(
         `failed to remove player ${client.playerId} from game ${gameId} (GAME_NOT_FOUND)`
      );
      return;
   }

   // grab current opponent/role for broadcast
   const opponent = client.opponent;
   const role = client.getCurrentRole();

   game.removePlayer(client);
   client.send('game:leave', '/games');
   opponent?.send('game:playerLeave', client.username, role);
   game.getObservers().forEach((observer) => {
      observer.send('game:playerLeave', client.username, role);
   });

   logger(`player ${client.playerId} left game ${gameId} (role: ${role})`);
};
