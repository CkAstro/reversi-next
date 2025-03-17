import type { SocketHandler } from '@/types/socket';

export const gameLeave: SocketHandler['game:leave'] = (_socket) => (_gameId) =>
   undefined;
