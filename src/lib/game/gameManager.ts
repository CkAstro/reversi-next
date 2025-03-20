import type { Client } from '@/lib/client/Client';
import { createGame } from '@/lib/game/Game';
import {
   getPendingGames,
   getActiveGames,
   getCompletedGames,
   getGame,
} from '@/lib/game/gameCache';
import type { Reversi } from '@/types/reversi';
import type { GameInfoResponse, ServerError } from '@/types/socket';

const getLobby = (): GameInfoResponse => ({
   pending: getPendingGames(),
   active: getActiveGames(),
   complete: getCompletedGames(),
});

const create = (
   client: Client,
   callback: (gameId: Reversi['GameId'], role: Reversi['Role']) => void
) => {
   const game = createGame(client);
   const gameId = game.gameId;
   const role = game.getRoleById(client.playerId);

   callback(gameId, role);
};

const join = (
   gameId: Reversi['GameId'],
   client: Client,
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', null, null, null);

   const role = game.addPlayer(client);
   const opponent = client.opponent;
   const observers = game.getObservers();
   callback(null, role, opponent, observers);
};

const leave = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', null, null, null);

   const opponent = game.getOpponentById(playerId);
   const role = game.getRoleById(playerId);
   const observers = game.getObservers();
   callback(null, role, opponent, observers);
};

const observe = (
   gameId: Reversi['GameId'],
   client: Client,
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', null, null, null);

   const role = game.addPlayer(client);
   const opponent = client.opponent;
   const observers = game.getObservers();
   callback(null, role, opponent, observers);
};

const getBoardState = (
   gameId: Reversi['GameId'],
   callback: (
      error: ServerError | null,
      boardState: Reversi['BoardState'],
      turn: Reversi['PlayerRole']
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', [], 1);

   callback(null, game.getBoardState(), game.turn);
};

const requestMove = (
   gameId: Reversi['GameId'],
   playerRole: Reversi['PlayerRole'],
   moveIndex: number,
   callback: (
      error: ServerError | null,
      boardState: Reversi['BoardState'],
      turn: Reversi['PlayerRole'],
      clients: Client[]
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', [], 1, []);

   const validMove = game.placeGamePiece(playerRole, moveIndex);
   if (!validMove) return callback('INVALID_MOVE', [], playerRole, []);

   const boardState = game.getBoardState();
   const turn = game.turn;
   const clients = game.getAllClients();

   callback(null, boardState, turn, clients);
};

export const gameManager = {
   getLobby,
   create,
   join,
   leave,
   observe,
   getBoardState,
   requestMove,
};
