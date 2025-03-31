import type { SocketHandler } from '@/types/socket';

export const playerChat: SocketHandler['player:chat'] = (_client) => () =>
   undefined;
