import { gameManager } from '@/lib/game/gameManager';
import type { SocketHandler } from '@/types/socket';

export const getGames: SocketHandler['get:games'] = (client) => () =>
   client.send('get:games', gameManager.getLobby());
