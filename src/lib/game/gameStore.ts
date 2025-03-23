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

const playerAList = ['playerA', 'player 1', 'player N', 'test player'];
const playerBList = ['playerB', 'player 2', 'player M', 'other player'];
const getPlayer = (list?: 'A' | 'B'): string =>
   list === 'A'
      ? playerAList[Math.floor(Math.random() * playerAList.length)]
      : list === 'B'
      ? playerBList[Math.floor(Math.random() * playerBList.length)]
      : Math.random() < 0.5
      ? getPlayer('A')
      : getPlayer('B');

for (let i = 0; i < 2; i++) {
   pendingCache.insert(`pending${i}`, {
      gameId: `pending${i}`,
      player: getPlayer(),
   });
}

for (let i = 0; i < 30; i++) {
   activeCache.insert(`active${i}`, {
      gameId: `active${i}`,
      playerA: getPlayer('A'),
      playerB: getPlayer('B'),
      observerCount: Math.floor(Math.random() * 5),
   });

   const score = Math.floor(Math.random() * 50) + 5;
   completedCache.insert(`completed${i}`, {
      gameId: `completed${i}`,
      playerA: { name: getPlayer('A'), role: 1, score },
      playerB: { name: getPlayer('B'), role: -1, score: 64 - score },
   });
}
