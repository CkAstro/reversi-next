import { createNewBoard } from '@/lib/boardState/createNewBoard';
import type { Client } from '@/lib/client/Client';
import { addPendingGame } from './gameCache';
import { getRandomId } from '@/lib/utils/getRandomId';
import type { Reversi } from '@/types/reversi';
import { assignToGame } from './assignToGame';
import { unassignFromGame } from './unassignFromGame';
import { getOpponentByRole } from './getOpponentByRole';
import { getOpponentById } from './getOpponentById';
import { getBoardState } from './getBoardState';
import { getRoleById } from './getRoleById';
import { getClientById } from './getClientById';
import { addObserver } from './addObserver';
import { addPlayer } from './addPlayer';
import { removePlayer } from './removePlayer';
import { placeGamePiece } from './placeGamePiece';
import { getAllClients } from './getAllClients';
import { getPlayers } from './getPlayers';

class Game {
   private id: Reversi['GameId'];
   public _boardState: Reversi['BoardState'];
   public _moveHistory: Reversi['PlayerMove'][];
   public _firstTurn: Reversi['PlayerRole'];
   // private previousMove: unknown | null;
   public _currentTurn: Reversi['PlayerRole'];
   public _currentRound: number;
   public _currentStatus: Reversi['GameStatus'];
   public _playerA: Client | null;
   public _playerB: Client | null;
   public _observers: Map<Reversi['PlayerId'], Client>;

   public constructor(client: Client) {
      this.id = getRandomId();
      this._boardState = createNewBoard();
      this._moveHistory = [];
      this._firstTurn = Math.random() < 0.5 ? 1 : -1;
      // this.previousMove = null;
      this._currentTurn = this._firstTurn;
      this._currentRound = 0;
      this._currentStatus = 'pending';
      this._playerA = null;
      this._playerB = null;
      this._observers = new Map<Reversi['PlayerId'], Client>();

      // init
      const playerRole = Math.random() < 0.5 ? 1 : -1;
      this._assignToGame(client, playerRole);
   }

   public get gameId() {
      return this.id;
   }

   public get turn() {
      return this._currentTurn;
   }

   public get status() {
      return this._currentStatus;
   }

   public getObservers() {
      return this._observers;
   }

   public get observerCount() {
      return this._observers.size;
   }

   public isComplete() {
      return this.status === 'complete';
   }

   public _assignToGame = assignToGame;
   public _unassignFromGame = unassignFromGame;
   public getOpponentByRole = getOpponentByRole;
   public getOpponentById = getOpponentById;
   public getBoardState = getBoardState;
   public getRoleById = getRoleById;
   public getClientById = getClientById;
   public addObserver = addObserver;
   public addPlayer = addPlayer;
   public removePlayer = removePlayer;
   public placeGamePiece = placeGamePiece;
   public getAllClients = getAllClients;
   public getPlayers = getPlayers;
}

export type { Game };

export const createGame = (client: Client) => {
   const game = new Game(client);
   addPendingGame(game);

   return game;
};
