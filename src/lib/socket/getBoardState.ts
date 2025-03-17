import type { SocketHandler } from '@/types/socket';

export const getBoardState: SocketHandler['get:boardState'] =
   (_socket) => (_gameId) =>
      undefined;
