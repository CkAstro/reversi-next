import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function assignToGame(
   this: Game,
   client: Client,
   role: Reversi['Role']
): Reversi['Role'] {
   if (role === 1) this._playerA = client;
   else if (role === -1) this._playerB = client;
   else if (role === 0) this._observers.set(client.playerId, client);

   const opponent = this.getOpponentByRole(role);

   client.setGame(this);
   client.setCurrentRole(role);
   client.setOpponent(opponent);
   opponent?.setOpponent(client);

   return role;
}
