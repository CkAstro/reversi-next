import { gameManager } from '@/lib/game/gameManager';
import type { SocketHandler } from '@/types/socket';

export const getGames: SocketHandler['get:games'] = (client) => () => {
   const games = gameManager.getLobby();
   client.send('get:games', games);
};
