import { OrderedCache } from '@/lib/game/OrderedCache';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PendingGameInfo,
} from '@/types/socket';

// eventually move these to redis/mongo storage
export const gameCache = new OrderedCache<Reversi['GameId'], Game>();
export const pendingCache = new OrderedCache<
   Reversi['GameId'],
   PendingGameInfo
>();
export const activeCache = new OrderedCache<
   Reversi['GameId'],
   ActiveGameInfo
>();
export const completedCache = new OrderedCache<
   Reversi['GameId'],
   CompletedGameInfo
>();
