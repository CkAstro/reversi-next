import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

/** add observer to game
 * @param gameId id of game
 * @param playerId id of observer
 * @param callback { error }
 */
export const addObserver = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   callback: (result: { error: string } | { error?: never }) => void
) => {
   const game = getGame(gameId);

   if (game === null) return callback({ error: 'Game does not exist.' });
   logger(`observer ${playerId} has joined game ${gameId}`);

   game.observers.push({ playerId, username: 'no username', role: 0 });
   callback({});
};
