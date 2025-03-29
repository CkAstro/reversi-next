import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const gameCreate: SocketHandler['game:create'] = (client) => () => {
   gameManager.create(client, (gameId, role) => {
      client.send('game:join', gameId, role, null);

      logger(
         `game ${gameId} created by player ${client.playerId} (role: ${role})`
      );
   });
};
