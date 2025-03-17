import type { SocketHandler } from '@/types/socket';

export const gameObserve: SocketHandler['game:observe'] =
   (_socket) => (_gameId) =>
      undefined;
