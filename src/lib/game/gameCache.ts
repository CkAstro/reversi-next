import type { Game } from '@/lib/game/Game';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';
import {
   gameCache,
   pendingCache,
   activeCache,
   completedCache,
} from '@/lib/game/gameStore';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PendingGameInfo,
} from '@/types/socket';

/** Adds a new game to cache.
 * @param game game to add
 */
export const addPendingGame = (game: Game) => {
   const gameId = game.gameId;

   gameCache.insert(gameId, game);

   const [playerA, playerB] = game.getPlayers();
   const player = playerA ?? playerB ?? 'unknown';
   pendingCache.insert(gameId, { gameId, player });
};

/** Deletes a pending game from cache. If the game is
 * in cache but is not pending, nothing will happen.
 * @param gameId id of game
 */
export const deletePendingGame = (gameId: Reversi['GameId']) => {
   if (pendingCache.remove(gameId) === null) return;
   gameCache.remove(gameId);
};

/** upgrade game status from pending to active
 * @param gameId id of game to upgrade
 */
export const upgradePendingGame = (gameId: Reversi['GameId']) => {
   if (pendingCache.remove(gameId) === null) return;

   const game = gameCache.getValue(gameId);
   if (game === null) return;
   const [playerA, playerB] = game.getPlayers();
   if (playerA === null || playerB === null)
      return logger(
         `attempted to upgrade game ${gameId} to active, but one or more players were not found.`
      );

   game.startGame();
   const observerCount = game.observerCount;
   activeCache.insert(gameId, { gameId, playerA, playerB, observerCount });
};

/** upgrade game status from active to completed
 * @param gameId id of game to upgrade
 */
export const upgradeActiveGame = (gameId: Reversi['GameId']) => {
   if (activeCache.remove(gameId) === null) return;

   const game = gameCache.getValue(gameId);
   if (game === null) return;

   const [playerA, playerB] = game.getPlayers();
   if (playerA === null || playerB === null)
      return logger(
         `attempted to upgrade game ${gameId} to complete, but one or more players were not found.`
      );

   game.completeGame();
   const scores = [0, 0];
   game.getBoardState().forEach((value) => {
      if (value === 1) scores[0]++;
      else if (value === -1) scores[1]++;
   });

   completedCache.insert(gameId, {
      gameId,
      playerA: { name: playerA, role: 1, score: scores[0] },
      playerB: { name: playerB, role: -1, score: scores[1] },
   });
};

/** get game from cache
 * @param gameId id of game
 * @returns Game object or null if game is not found
 */
export const getGame = (gameId: Reversi['GameId']) =>
   gameCache.getValue(gameId);

/** get paginated list of pending games
 * @param count number of games to return
 * @param page page of games
 */
export const getPendingGames = (count = 10, page = 0): PendingGameInfo[] =>
   pendingCache.getRange(count, page);

/** get paginated list of active games
 * @param count number of games to return
 * @param page page of games
 */
export const getActiveGames = (count = 10, page = 0): ActiveGameInfo[] =>
   activeCache.getRange(count, page);

/** get paginated list of completed games
 * @param count number of games to return
 * @param page page of games
 */
export const getCompletedGames = (count = 10, page = 0): CompletedGameInfo[] =>
   completedCache.getRange(count, page);

export const _forTesting = {
   gameCache,
   pendingCache,
   activeCache,
   completedCache,
};
