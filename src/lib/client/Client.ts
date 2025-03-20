import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';
import type { ResponsePayload, ServerSocket } from '@/types/socket';

export class Client {
   private id: string;
   private socket: ServerSocket;
   private currentGame: Game | null;
   private currentRole: Reversi['Role'];

   public constructor(playerId: Reversi['PlayerId'], socket: ServerSocket) {
      this.id = playerId;
      this.socket = socket;
      this.currentGame = null;
      this.currentRole = null;
   }

   public get playerId() {
      return this.id;
   }

   public get game() {
      return this.currentGame;
   }

   public setGame(game: Game | null) {
      this.currentGame = game;
   }

   public getCurrentRole() {
      return this.currentRole;
   }

   public setCurrentRole(role: Reversi['Role']) {
      this.currentRole = role;
   }

   public send<E extends keyof ResponsePayload>(
      event: E,
      ...payload: Parameters<ResponsePayload[E]>
   ) {
      this.socket.emit(event, ...payload);
   }
}
