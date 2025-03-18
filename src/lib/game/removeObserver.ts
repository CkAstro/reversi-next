import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

/** remove observer from game
 * @param gameId id of game
 * @param playerId id of observer
 * @param callback { error }
 */
export const removeObserver = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   callback: (result: { error: string } | { error?: never }) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback({ error: 'Game does not exist.' });
   logger(`observer ${playerId} has left game ${gameId}`);

   const observerIndex = game.observers.findIndex(
      ({ playerId: id }) => id === playerId
   );
   if (observerIndex === -1)
      return callback({ error: 'player is not observing this game.' });

   game.observers.splice(observerIndex, 1);
   callback({});
};
