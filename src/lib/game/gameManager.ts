import { createNewBoard } from '@/lib/boardState/createNewBoard';
import { getRandomId } from '@/lib/utils/getRandomId';
import { logger } from '@/lib/utils/logger';
import { validateMove } from '@/lib/validateMove';
import type { Reversi } from '@/types/reversi';

// --- game cache
const MAX_COMPLETED = 10;

type GameCache = Record<Reversi['GameId'], Reversi['Game']>;
const gameCache: GameCache = {};

/** look up game in cache, optionally from save
 * @param gameId id of game
 * @param cacheOnly if false, query game db
 */
const getGame = (
   gameId: Reversi['GameId'],
   cacheOnly = true
): Reversi['Game'] | null => {
   if (!(gameId in gameCache) && cacheOnly) return null;
   return gameCache[gameId];
};

type GameList = Reversi['GameId'][];
const pendingGames: GameList = [];
const activeGames: GameList = [];
const completedGames: GameList = [];

/** add a pending game to cache
 * @param game game to add
 */
const addPendingGame = (game: Reversi['Game']) => {
   const gameId = game.gameId;

   gameCache[gameId] = game;
   pendingGames.unshift(gameId);
};

/** delete a pending game from cache
 * @param gameId id of game
 */
const deletePendingGame = (gameId: Reversi['GameId']) => {
   const gameIndex = pendingGames.indexOf(gameId);
   if (gameIndex > -1) pendingGames.splice(gameIndex, 1);
   if (gameId in gameCache) delete gameCache[gameId];
};

/** upgrade game status from pending to active
 * @param gameId id of game
 */
const upgradePendingGame = (gameId: Reversi['GameId']) => {
   const gameIndex = pendingGames.indexOf(gameId);
   if (gameIndex === -1) return;
   pendingGames.splice(gameIndex, 1);
   activeGames.unshift(gameId);
};

/** upgrade game status from active to completed
 * @param gameId id of game
 */
const upgradeActiveGame = (gameId: Reversi['GameId']): boolean => {
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

// --- game-specific
/** create a new game
 * @param playerId id of initial player
 */
const createGame = (
   playerId: Reversi['PlayerId'],
   callback: (
      result:
         | { error: string; gameId: never; role: never }
         | {
              error?: never;
              gameId: Reversi['GameId'];
              role: Reversi['PlayerRole'];
           }
   ) => void
) => {
   const playerRole: Reversi['PlayerRole'] = Math.random() < 0.5 ? 1 : -1;
   const playerInfo: Reversi['PlayerInfo'] = {
      playerId,
      username: 'no username',
      role: playerRole,
   };

   const gameId: Reversi['GameId'] = getRandomId();
   const boardState = createNewBoard();
   const moveHistory: Reversi['PlayerMove'][] = [];
   const turn: Reversi['PlayerRole'] = Math.random() < 0.5 ? 1 : -1;
   const gameStatus: Reversi['GameStatus'] = 'waiting';
   const playerA: Reversi['PlayerInfo'] | null = playerInfo;
   const playerB: Reversi['PlayerInfo'] | null = null;
   const observers: Reversi['PlayerInfo'][] = [];

   const game = {
      gameId,
      boardState,
      moveHistory,
      turn,
      gameStatus,
      playerA,
      playerB,
      observers,
   };

   addPendingGame(game);
   callback({ gameId, role: playerRole });
   logger(`player ${playerId} has created game ${game.gameId}`);
};

/** complete a finished game
 * @param gameId: id of game
 */
const completeGame = (
   gameId: Reversi['GameId'],
   callback: (result: { error?: string }) => void
) => {
   const success = upgradeActiveGame(gameId);
   if (success) callback({});
   else callback({ error: 'Encountered an issue while completing game.' });
};

/** assign player to game
 * @param playerId id of player
 * @param username username of player
 * @param role role of player
 */
const assignPlayerToGame = (
   game: Reversi['Game'],
   firstSlot: boolean,
   playerId: Reversi['PlayerId'],
   username: Reversi['PlayerInfo']['username']
): Reversi['PlayerRole'] => {
   const slot = firstSlot ? 'playerA' : 'playerB';
   const opponent = firstSlot ? 'playerB' : 'playerA';
   game[slot] = {
      playerId,
      username,
      role: -game[opponent]!.role as Reversi['PlayerRole'],
   };
   logger(`player ${playerId} has been assigned to game ${game.gameId}`);

   return game[slot].role as Reversi['PlayerRole'];
};

/** add player to game
 * @param gameId id of game
 * @param playerId id of player
 */
const addPlayer = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   callback: (
      result:
         | { error: string; role?: never; opponentId?: never }
         | {
              error?: never;
              role: Reversi['PlayerRole'];
              opponentId: Reversi['PlayerId'];
           }
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback({ error: 'Game does not exist.' });

   const { playerA, playerB } = game;
   if (playerA !== null && playerB !== null)
      return callback({ error: 'Game is full.' });

   const firstSlotIsEmpty = game.playerA === null;
   const role = assignPlayerToGame(
      game,
      firstSlotIsEmpty,
      playerId,
      'no username'
   );

   const opponentId = firstSlotIsEmpty
      ? game.playerB!.playerId
      : game.playerA!.playerId;

   callback({ role, opponentId });
};

/** NOT SUPPORTED -- remove player from game
 * @param gameId id of game
 * @param playerId id of player
 */
const removePlayer = (
   _gameId: Reversi['GameId'],
   _playerId: Reversi['PlayerId']
) => {
   throw new Error('not currently supported.');
};

/** add observer to game
 * @param gameId id of game
 * @param playerId id of observer
 */
const addObserver = (
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

/** remove observer from game
 * @param gameId id of game
 * @param playerId id of observer
 */
const removeObserver = (
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

/** request a move for a given player */
const requestMove = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   moveIndex: number,
   callback: (
      result:
         | { error: string; boardState?: never }
         | { error?: never; boardState: Reversi['BoardState'] }
   ) => void
) => {
   logger(`player ${playerId} requested move ${moveIndex} in game ${gameId}`);
   const game = getGame(gameId);
   if (game === null) return callback({ error: 'Game does not exist.' });

   const playerRole =
      game.playerA?.playerId === playerId
         ? game.playerA.role
         : game.playerB?.playerId === playerId
         ? game.playerB.role
         : null;

   if (playerRole === null)
      return callback({ error: 'Player is not active in this game.' });

   const boardState = validateMove(
      game.boardState,
      playerRole as Reversi['PlayerRole'],
      moveIndex
   );

   if (boardState === null) return callback({ error: 'Move not allowed.' });
   callback({ boardState });
};

/** get the opponent of a given player
 * @param gameId id of game
 * @param playerId id of player
 */
const getOpponent = (
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

/** get all participants for a game
 * @param gameId id of game
 */
const getParticipants = (gameId: Reversi['GameId']): Reversi['PlayerId'][] => {
   const game = getGame(gameId);
   if (game === null) return [];

   const playerA = game.playerA?.playerId ?? null;
   const playerB = game.playerB?.playerId ?? null;
   const observers = game.observers.map(({ playerId }) => playerId);

   return [playerA, playerB, ...observers].filter(
      (playerId) => playerId !== null
   );
};

// --- manager-specific

/** returns paginated list of complete games
 * @param count number of games to return
 * @param page page of games
 */
const getActiveGames = (count = 10, page = 0) =>
   activeGames.slice(count * page, count * (page + 1));

/** returns paginated list of complete games
 * @param count number of games to return
 * @param page page of games
 */
const getWaitingGames = (count = 10, page = 0) =>
   pendingGames.slice(count * page, count * (page + 1));

/** returns paginated list of complete games
 * @param count number of games to return
 * @param page page of games
 */
const getCompletedGames = (count = 10, page = 0) =>
   completedGames.slice(count * page, count * (page + 1));

/** save game to db
 * @param gameId id of game
 */
const saveGame = (_gameId: Reversi['GameId']) => undefined;

/** returns lobby information
 * @returns active, waiting, complete games
 */
const getLobby = () => undefined;

export const gameManager = {
   createGame,
   completeGame,
   addPlayer,
   removePlayer,
   addObserver,
   removeObserver,
   requestMove,
   getOpponent,
   getParticipants,
   getActiveGames,
   getWaitingGames,
   getCompletedGames,
   saveGame,
   getLobby,
};
