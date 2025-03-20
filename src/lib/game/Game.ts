import { createNewBoard } from '@/lib/boardState/createNewBoard';
import type { Client } from '@/lib/client/Client';
import { addPendingGame } from '@/lib/game/gameCache';
import { getRandomId } from '@/lib/utils/getRandomId';
import { validateMove } from '@/lib/validateMove';
import type { Reversi } from '@/types/reversi';

class Game {
   private id: Reversi['GameId'];
   private boardState: Reversi['BoardState'];
   private moveHistory: Reversi['PlayerMove'][];
   private firstTurn: Reversi['PlayerRole'];
   // private previousMove: unknown | null;
   private currentTurn: Reversi['PlayerRole'];
   private currentRound: number;
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
      this.currentRound = 0;
      this.currentStatus = 'pending';
      this.playerA = null;
      this.playerB = null;
      this.observers = new Map<Reversi['PlayerId'], Client>();

      // init
      const playerRole = Math.random() < 0.5 ? 1 : -1;
      this.assignToGame(client, playerRole);
   }

   private assignToGame(
      client: Client,
      role: Reversi['Role']
   ): Reversi['Role'] {
      if (role === 1) this.playerA = client;
      else if (role === -1) this.playerB = client;
      else if (role === 0) this.observers.set(client.playerId, client);

      const opponent = this.getOpponentByRole(role);

      client.setGame(this);
      client.setCurrentRole(role);
      client.setOpponent(opponent);
      opponent?.setOpponent(client);

      return role;
   }

   private unassignFromGame(
      client: Client,
      role: Reversi['Role']
   ): Reversi['Role'] {
      if (role === 1) this.playerA = null;
      else if (role === -1) this.playerB = null;
      else if (role === 0) this.observers.delete(client.playerId);

      const opponent = this.getOpponentByRole(role);

      client.setGame(null);
      client.setCurrentRole(null);
      client.setOpponent(null);
      opponent?.setOpponent(null);

      return role;
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

   public getOpponentByRole(role: Reversi['Role']): Client | null {
      return role === 1 ? this.playerB : role === -1 ? this.playerA : null;
   }

   public getOpponentById(playerId: Reversi['PlayerId']): Client | null {
      return this.playerA?.playerId === playerId
         ? this.playerB
         : this.playerB?.playerId === playerId
         ? this.playerA
         : null;
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

   public addObserver(client: Client) {
      if (this.observers.has(client.playerId)) return;
      this.assignToGame(client, 0);
   }

   public getObservers() {
      return this.observers;
   }

   public get observerCount() {
      return this.observers.size;
   }

   public addPlayer(client: Client) {
      const currentRole = this.getRoleById(client.playerId);
      if (currentRole !== null) return this.assignToGame(client, currentRole);
      if (this.playerA === null) return this.assignToGame(client, 1);
      if (this.playerB === null) return this.assignToGame(client, -1);

      this.addObserver(client);
      return 0;
   }

   public removePlayer(client: Client): Reversi['Role'] {
      const currentRole = this.getRoleById(client.playerId);
      if (currentRole === null) return null;

      return this.unassignFromGame(client, currentRole);
   }

   public placeGamePiece(role: Reversi['Role'], moveIndex: number): boolean {
      if (role !== this.currentTurn) return false;

      const nextBoardState = validateMove(
         this.boardState,
         moveIndex,
         this.currentTurn,
         this.currentRound
      );

      if (nextBoardState === null) return false;
      this.boardState = nextBoardState;
      this.currentTurn = -this.currentTurn as Reversi['PlayerRole'];
      this.currentRound++;
      this.moveHistory.push({ player: role, move: moveIndex });
      return true;
   }

   public getAllClients() {
      const clients = [...this.observers.values()];
      if (this.playerB !== null) clients.unshift(this.playerB);
      if (this.playerA !== null) clients.unshift(this.playerA);
      return clients;
   }

   public getPlayers(): [
      Reversi['Username'] | null,
      Reversi['Username'] | null
   ] {
      return [this.playerA?.username ?? null, this.playerB?.username ?? null];
   }

   public isComplete() {
      return this.status === 'complete';
   }
}

export type { Game };

export const createGame = (client: Client) => {
   const game = new Game(client);
   addPendingGame(game);

   return game;
};
