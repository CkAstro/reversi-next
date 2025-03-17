import type { SocketHandler } from '@/types/socket';

export const gameJoin: SocketHandler['game:join'] = (_socket) => (_gameId) =>
   undefined;
