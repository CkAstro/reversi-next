import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function unassignFromGame(this: Game, client: Client): Reversi['Role'] {
   const role = this.getRoleById(client.playerId);
   if (role === null) return null;
   else if (role === 1) this._playerA = null;
   else if (role === -1) this._playerB = null;
   else this._observers.delete(client.playerId);

   const opponent = this.getOpponentByRole(role);

   client.setGame(null);
   client.setCurrentRole(null);
   client.setOpponent(null);
   opponent?.setOpponent(null);

   return role;
}
