import { createNewBoard } from '@/lib/boardState/createNewBoard';
import type { Client } from '@/lib/client/Client';
import { addPendingGame } from '@/lib/game/gameCache';
import { getRandomId } from '@/lib/utils/getRandomId';
import type { Reversi } from '@/types/reversi';

class Game {
   private id: Reversi['GameId'];
   private boardState: Reversi['BoardState'];
   private moveHistory: Reversi['PlayerMove'][];
   private firstTurn: Reversi['PlayerRole'];
   // private previousMove: unknown | null;
   private currentTurn: Reversi['PlayerRole'];
   private currentStatus: Reversi['GameStatus'];
   private playerA: Client | null;
   private playerB: Client | null;
   private observers: Map<Reversi['PlayerId'], Client>;

   public constructor(client: Client) {
      this.id = getRandomId();
      this.boardState = createNewBoard();
      this.moveHistory = [];
      this.firstTurn = Math.random() < 0.5 ? 1 : -1;
      // this.previousMove = null;
      this.currentTurn = this.firstTurn;
      this.currentStatus = 'pending';
      this.playerA = null;
      this.playerB = null;
      this.observers = new Map<Reversi['PlayerId'], Client>();

      // init
      const playerRole = Math.random() < 0.5 ? 1 : -1;
      if (playerRole === 1) this.playerA = client;
      else this.playerB = client;
      client.setGame(this);
      client.setCurrentRole(playerRole);
   }

   public get gameId() {
      return this.id;
   }

   public get turn() {
      return this.currentTurn;
   }

   public get status() {
      return this.currentStatus;
   }

   public getBoardState() {
      return [...this.boardState];
   }

   public getRoleById(playerId: Reversi['PlayerId']) {
      if (this.playerA?.playerId === playerId) return 1;
      if (this.playerB?.playerId === playerId) return -1;
      if (this.observers.get(playerId)) return 0;
      return null;
   }
}

export type { Game };

export const createGame = (client: Client) => {
   const game = new Game(client);
   addPendingGame(game);

   return game;
};
