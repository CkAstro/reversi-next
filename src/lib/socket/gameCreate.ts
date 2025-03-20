import { createGame } from '@/lib/game/Game';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameCreate: SocketHandler['game:create'] = (client) => () => {
   const game = createGame(client);

   const gameId = game.gameId;
   const role = game.getRoleById(client.playerId);
   client.send('game:join', gameId, role);

   logger(
      `game ${gameId} created by player ${client.playerId} (role: ${role})`
   );
};
