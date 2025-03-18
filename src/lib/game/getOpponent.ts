import { getGame } from '@/lib/game/gameCache';
import type { Reversi } from '@/types/reversi';

/** get the opponent of a given player
 * @param gameId id of game
 * @param playerId id of player
 */
export const getOpponent = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId']
): Reversi['PlayerId'] | null => {
   const game = getGame(gameId);
   if (game === null) return null;
   if (game.playerA?.playerId === playerId)
      return game.playerB?.playerId ?? null;
   if (game.playerB?.playerId === playerId)
      return game.playerA?.playerId ?? null;
   return null;
};
