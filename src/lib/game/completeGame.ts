import { upgradeActiveGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

/** complete a finished game
 * @param gameId: id of game
 * @param callback { error }
 */
export const completeGame = (
   gameId: Reversi['GameId'],
   callback: (result: { error?: string }) => void
) => {
   const success = upgradeActiveGame(gameId);
   if (success) callback({});
   else callback({ error: 'Encountered an issue while completing game.' });

   if (success) logger(`successfully completed game ${gameId}`);
   else logger(`unable to complete game ${gameId}`);
};
