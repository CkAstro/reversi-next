import type { Game } from '@/lib/game/Game';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';
import {
   fetchCompletedGames,
   getPlayer,
   liveGames,
   saveToDatabase,
} from '@/lib/game/gameStore';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PendingGameInfo,
} from '@/types/socket';
import { getGameCache } from '@/lib/redis/gameCache';

/** Adds a new game to cache.
 * @param game game to add
 */
export const addPendingGame = async (game: Game) => {
   const gameId = game.gameId;

   liveGames.insert(gameId, game);
   const [playerA, playerB] = game.getPlayers();
   const player = playerA ?? playerB ?? 'unknown';

   try {
      const cache = await getGameCache();
      cache.addToPending(gameId, player);
   } catch {
      logger('unable to add pending game');
   }
};

/** Deletes a pending game from cache. If the game is
 * in cache but is not pending, nothing will happen.
 * @param gameId id of game
 */

export const deletePendingGame = async (gameId: Reversi['GameId']) => {
   const cache = await getGameCache();
   const exists = await cache.removeFromPending(gameId);
   if (!exists) return;

   liveGames.remove(gameId);
};

/** upgrade game status from pending to active
 * @param gameId id of game to upgrade
 */
export const upgradePendingGame = async (gameId: Reversi['GameId']) => {
   const cache = await getGameCache();
   const exists = await cache.removeFromPending(gameId);
   if (!exists) return;

   const game = liveGames.getValue(gameId);
   if (game === null)
      return logger(`pending game ${gameId} was not present in game cache.`);

   const [playerA, playerB] = game.getPlayers();
   if (playerA === null || playerB === null)
      return logger(
         `attempted to upgrade game ${gameId} to active, but one or more players were not found.`
      );

   game.startGame();
   const observerCount = game.observerCount;

   return cache.addToActive(gameId, playerA, playerB, observerCount);
};

/** upgrade game status from active to completed
 * @param gameId id of game to upgrade
 */
export const upgradeActiveGame = async (gameId: Reversi['GameId']) => {
   const cache = await getGameCache();
   const exists = await cache.removeFromActive(gameId);
   if (!exists) return;

   const game = liveGames.getValue(gameId);
   if (game === null) return;

   const [playerA, playerB] = game.getPlayers();
   if (playerA === null || playerB === null)
      return logger(
         `attempted to upgrade game ${gameId} to complete, but one or more players were not found.`
      );

   game.completeGame();
   saveToDatabase(game);

   const score: [number, number] = [0, 0];
   game.getBoardState().forEach((value) => {
      if (value === 1) score[0]++;
      else if (value === -1) score[1]++;
   });

   cache.addToComplete(gameId, playerA, playerB, score);
};

/** get game from cache
 * @param gameId id of game
 * @returns Game object or null if game is not found
 */
export const getGame = (gameId: Reversi['GameId']) =>
   liveGames.getValue(gameId);

/** get paginated list of pending games
 * @param count number of games to return
 * @param page page of games
 */
export const getPendingGames = (
   count = 10,
   page = 0
): Promise<PendingGameInfo[]> =>
   getGameCache().then((cache) => cache.getPending(count, page));

/** get paginated list of active games
 * @param count number of games to return
 * @param page page of games
 */
export const getActiveGames = (
   count = 10,
   page = 0
): Promise<ActiveGameInfo[]> =>
   getGameCache().then((cache) => cache.getActive(count, page));

/** get paginated list of completed games
 * @param count number of games to return
 * @param page page of games
 */
export const getCompletedGames = async (
   count = 10,
   page = 0
): Promise<CompletedGameInfo[]> =>
   fetchCompletedGames()
      .then(() => getGameCache())
      .then((cache) => cache.getComplete(count, page))
      .then((games) =>
         games.map(({ gameId, playerA, playerB, score }) => ({
            gameId,
            playerA: playerA === '' ? getPlayer('A') : playerA,
            playerB: playerB === '' ? getPlayer('B') : playerB,
            score,
         }))
      );
