import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';
import type { ResponsePayload, ServerSocket } from '@/types/socket';

export class Client {
   private id: string;
   private _username: string;
   private socket: ServerSocket;
   private currentGame: Game | null;
   private currentRole: Reversi['Role'];
   private currentOpponent: Client | null;

   public constructor(playerId: Reversi['PlayerId'], socket: ServerSocket) {
      this.id = playerId;
      this._username = socket.handshake.auth.username ?? '';
      this.socket = socket;
      this.currentGame = null;
      this.currentRole = null;
      this.currentOpponent = null;
   }

   private joinGameRoom() {
      if (this.currentGame === null) return;
      const roomName = this.currentGame.gameId;
      this.socket.join(roomName);
   }

   private leaveGameRoom() {
      if (this.currentGame === null) return;
      const roomName = this.currentGame.gameId;
      this.socket.leave(roomName);
   }

   public get playerId() {
      return this.id;
   }

   public get username() {
      return this._username;
   }

   public get game() {
      return this.currentGame;
   }

   public setGame(game: Game | null) {
      if (game?.gameId === this.currentGame?.gameId) return;
      this.leaveGameRoom();

      this.currentGame = game;
      this.joinGameRoom();
   }

   public getCurrentRole() {
      return this.currentRole;
   }

   public setCurrentRole(role: Reversi['Role']) {
      this.currentRole = role;
   }

   public get opponent() {
      return this.currentOpponent;
   }

   public setOpponent(client: Client | null) {
      this.currentOpponent = client;
   }

   public send<E extends keyof ResponsePayload>(
      event: E,
      ...payload: Parameters<ResponsePayload[E]>
   ) {
      this.socket.emit(event, ...payload);
   }

   public sendToRoom<E extends keyof ResponsePayload>(
      event: E,
      ...payload: Parameters<ResponsePayload[E]>
   ) {
      if (this.currentGame === null) return;

      const roomName = this.currentGame.gameId;
      this.socket.to(roomName).emit(event, ...payload);
   }

   public getAuthKey() {
      return this.socket.handshake.auth.key;
   }

   public updateInfo(
      playerId: Reversi['PlayerId'],
      username: Reversi['Username']
   ) {
      this.id = playerId;
      this._username = username;
   }
}
