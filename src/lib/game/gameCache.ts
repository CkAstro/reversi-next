import type { Reversi } from '@/types/reversi';

const MAX_COMPLETED = 10;

type GameCache = Record<Reversi['GameId'], Reversi['Game']>;
const gameCache: GameCache = {};

/** look up game in cache, optionally from save
 * @param gameId id of game
 * @param cacheOnly if false, query game db
 */
export const getGame = (
   gameId: Reversi['GameId'],
   cacheOnly = true
): Reversi['Game'] | null => {
   if (gameId in gameCache) return gameCache[gameId];
   if (cacheOnly) return null;

   // look in db
   console.warn('db not set, returning null game.');
   return null;
};

type GameList = Reversi['GameId'][];
const pendingGames: GameList = [];
const activeGames: GameList = [];
const completedGames: GameList = [];

/** add a pending game to cache
 * @param game game to add
 */
export const addPendingGame = (game: Reversi['Game']) => {
   const gameId = game.gameId;

   gameCache[gameId] = game;
   pendingGames.unshift(gameId);
};

/** delete a pending game from cache
 * @param gameId id of game
 */
export const deletePendingGame = (gameId: Reversi['GameId']) => {
   const gameIndex = pendingGames.indexOf(gameId);
   if (gameIndex !== -1) pendingGames.splice(gameIndex, 1);
   if (gameId in gameCache) delete gameCache[gameId];
};

/** upgrade game status from pending to active
 * @param gameId id of game
 */
export const upgradePendingGame = (gameId: Reversi['GameId']) => {
   const gameIndex = pendingGames.indexOf(gameId);
   if (gameIndex === -1) return;
   pendingGames.splice(gameIndex, 1);
   activeGames.unshift(gameId);
};

/** upgrade game status from active to completed
 * @param gameId id of game
 */
export const upgradeActiveGame = (gameId: Reversi['GameId']): boolean => {
   const gameIndex = activeGames.indexOf(gameId);
   if (gameIndex === -1) return false;
   activeGames.splice(gameIndex, 1);
   completedGames.unshift(gameId);

   if (completedGames.length > MAX_COMPLETED) {
      completedGames.pop();
      delete gameCache[gameId];
   }

   return true;
};

/** returns paginated list of complete games
 * @param count number of games to return
 * @param page page of games
 */
export const getActiveGames = (count = 10, page = 0) =>
   page < 0 ? [] : activeGames.slice(count * page, count * (page + 1));

/** returns paginated list of complete games
 * @param count number of games to return
 * @param page page of games
 */
export const getPendingGames = (count = 10, page = 0) =>
   page < 0 ? [] : pendingGames.slice(count * page, count * (page + 1));

/** returns paginated list of complete games
 * @param count number of games to return
 * @param page page of games
 */
export const getCompletedGames = (count = 10, page = 0) =>
   page < 0 ? [] : completedGames.slice(count * page, count * (page + 1));

/** save game to db
 * @param gameId id of game
 */
export const saveGame = (_gameId: Reversi['GameId']) => {
   throw new Error('not available');
};

/** returns lobby information
 * @returns active, pending, complete games
 */
export const getLobby = () => {
   return {
      pending: getPendingGames(10),
      active: getActiveGames(10),
      completed: getCompletedGames(10),
   };
};

export const _forTesting = {
   gameCache,
   pendingGames,
   activeGames,
   completedGames,
   MAX_COMPLETED,
};
