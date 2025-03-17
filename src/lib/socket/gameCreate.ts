import { gameManager } from '@/lib/game/gameManager';
import type { SocketHandler } from '@/types/socket';

export const gameCreate: SocketHandler['game:create'] = (client) => () => {
   gameManager.createGame(client.playerId, ({ error, gameId, role }) => {
      if (error)
         client.socket.emit(
            'server:message',
            'unable to create new game',
            error
         );
      else client.socket.emit('game:join', gameId, role);
   });
};
