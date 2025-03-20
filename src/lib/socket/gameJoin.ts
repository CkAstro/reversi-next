import { getGame } from '@/lib/game/gameCache';
import type { SocketHandler } from '@/types/socket';

export const gameJoin: SocketHandler['game:join'] = (client) => (gameId) => {
   const game = getGame(gameId);
   if (game === null)
      return client.send(
         'server:message',
         'unable to join game',
         'game not available'
      );

   game.addPlayer(client);

   client.send(
      'game:join',
      game.gameId,
      client.role,
      client.opponent?.getUsername()
   );
   game.clientList.forEach((participant) => {
      if (participant.playerId === client.playerId) return;
      participant.send('game:playerJoin', client.getUsername(), client.role);
   });
};
