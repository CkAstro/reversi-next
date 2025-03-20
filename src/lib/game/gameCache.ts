import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

type GameCache = Record<Reversi['GameId'], Game>;
const gameCache: GameCache = {};

type GameList = Reversi['GameId'][];
const pendingGames: GameList = [];
// const activeGames: GameList = [];
// const completedGames: GameList = [];

/** Adds a new game to cache.
 * @param game game to add
 */
export const addPendingGame = (game: Game) => {
   const gameId = game.gameId;

   gameCache[gameId] = game;
   pendingGames.unshift(gameId);
};

/** Deletes a pending game from cache. If the game is
 * in cache but is not pending, nothing will happen.
 * @param gameId id of game
 */
export const deletePendingGame = (gameId: Reversi['GameId']) => {
   const gameIndex = pendingGames.indexOf(gameId);
   if (gameIndex === -1) return;

   pendingGames.splice(gameIndex, 1);
   delete gameCache[gameId];
};

export const getGame = (gameId: Reversi['GameId']) => {
   if (gameId in gameCache) return gameCache[gameId];
   return null;
};
