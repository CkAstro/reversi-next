import { gameManager } from '@/lib/game/gameManager';
import type { SocketHandler } from '@/types/socket';

export const gameJoin: SocketHandler['game:join'] = (client) => (gameId) => {
   gameManager.addPlayer(
      gameId,
      client.playerId,
      ({ error, role, opponentId }) => {
         if (error)
            client.socket.emit('server:message', 'unable to join game', error);
         else client.socket.emit('game:join', gameId, role!, opponentId);
      }
   );
};
