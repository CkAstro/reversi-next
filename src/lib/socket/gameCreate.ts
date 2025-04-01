import { gameManager } from '@/lib/gameManager/gameManager';
import { logger } from '@/lib/utils/logger';
import type { AddedGame, SocketHandler } from '@/types/socket';

export const gameCreate: SocketHandler['game:create'] = (client, io) => () => {
   gameManager.create(client, (gameId, role) => {
      client.send('game:join', gameId, role, 'pending', null);

      const gameInfo: AddedGame = {
         type: 'pending',
         game: { gameId, player: client.username },
      };
      io.emit('update:lobby', [gameInfo], []);

      const playerId = client.playerId;
      logger(`game ${gameId} created by player ${playerId} (role: ${role})`);
   });
};
