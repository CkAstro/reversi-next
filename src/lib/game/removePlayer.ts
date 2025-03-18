import type { Reversi } from '@/types/reversi';

/** NOT SUPPORTED -- remove player from game
 * @param gameId id of game
 * @param playerId id of player
 */
export const removePlayer = (
   _gameId: Reversi['GameId'],
   _playerId: Reversi['PlayerId']
) => {
   throw new Error('not currently supported.');
};
