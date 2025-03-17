import { gameManager } from '@/lib/game/gameManager';
import type { SocketHandler } from '@/types/socket';

export const getGames: SocketHandler['get:games'] = (socket) => () =>
   socket.emit('get:games', gameManager.getCurrentState());
