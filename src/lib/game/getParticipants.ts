import { getGame } from '@/lib/game/gameCache';
import type { Reversi } from '@/types/reversi';

/** get all participants for a game
 * @param gameId id of game
 */
export const getParticipants = (
   gameId: Reversi['GameId']
): Reversi['PlayerId'][] => {
   const game = getGame(gameId);
   if (game === null) return [];

   const playerA = game.playerA?.playerId ?? null;
   const playerB = game.playerB?.playerId ?? null;
   const observers = game.observers.map(({ playerId }) => playerId);

   const rtn = [playerA, playerB, ...observers].filter(
      (playerId) => playerId !== null
   );

   return rtn;
};
