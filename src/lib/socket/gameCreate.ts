import { createGame } from '@/lib/game/Game';
// import { gameManager } from '@/lib/game/gameManager';
// import { clientManager } from '@/lib/socket/clientManager';
import type { SocketHandler } from '@/types/socket';

export const gameCreate: SocketHandler['game:create'] = (client) => () => {
   createGame(client, (gameId, role) => {
      client.send('game:join', gameId, role);
      console.log(`player ${client.playerId} joined game ${gameId} (${role})`);
   });
};
