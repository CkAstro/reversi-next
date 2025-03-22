import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';

export function addPlayer(this: Game, client: Client) {
   const currentRole = this.getRoleById(client.playerId);
   if (currentRole !== null) return this._assignToGame(client, currentRole);
   if (this._playerA === null) return this._assignToGame(client, 1);
   if (this._playerB === null) return this._assignToGame(client, -1);

   this.addObserver(client);
   return 0;
}
