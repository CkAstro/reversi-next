import {
   getGame,
   upgradeActiveGame,
   upgradePendingGame,
} from '@/lib/game/cacheInterface';
import type { Reversi } from '@/types/reversi';

export const upgradeGame = (
   gameId: Reversi['GameId'],
   currentStatus: Extract<Reversi['GameStatus'], 'pending' | 'active'>
) => {
   const game = getGame(gameId);
   if (game === null) return;

   if (currentStatus === 'pending') upgradePendingGame(gameId);
   else upgradeActiveGame(gameId);
};
