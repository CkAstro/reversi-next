import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function removePlayer(
   this: Game,
   playerId: Reversi['PlayerId']
): Reversi['Role'] {
   const client = this.getClientById(playerId);
   if (client === null) return null;

   return this._unassignFromGame(client);
}
