import type { SocketHandler } from '@/types/socket';

export const gameReplay: SocketHandler['game:replay'] = (_client) => () =>
   undefined;
