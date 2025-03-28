import { gameManager } from '@/lib/gameManager/gameManager';
import type { SocketHandler } from '@/types/socket';

export const getGames: SocketHandler['get:games'] = (client) => () => {
   gameManager.getLobby().then((games) => client.send('get:games', games));
};
