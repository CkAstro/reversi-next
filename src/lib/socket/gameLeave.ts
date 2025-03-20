import { getGame } from '@/lib/game/gameCache';
import type { SocketHandler } from '@/types/socket';

export const gameLeave: SocketHandler['game:leave'] = (client) => (gameId) => {
   const game = getGame(gameId);
   if (game === null) return client.send('game:leave', '/games');

   game.removePlayer(client);

   client.send('game:leave', '/games');
   game.clientList.forEach((participant) => {
      participant.send('game:playerLeave', client.getUsername(), client.role);
   });
};
