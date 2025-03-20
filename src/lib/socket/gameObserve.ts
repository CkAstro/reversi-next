import type { SocketHandler } from '@/types/socket';

export const gameObserve: SocketHandler['game:observe'] =
   (_client) => (_gameId) =>
      undefined;
