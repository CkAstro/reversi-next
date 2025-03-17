import type { SocketHandler } from '@/types/socket';

export const playerMove: SocketHandler['player:move'] =
   (_socket) => (_gameId, _moveIndex) =>
      undefined;
