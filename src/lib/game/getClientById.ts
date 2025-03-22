import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function getClientById(
   this: Game,
   playerId: Reversi['PlayerId']
): Client | null {
   if (this._playerA?.playerId === playerId) return this._playerA;
   if (this._playerB?.playerId === playerId) return this._playerB;
   return this._observers.get(playerId) ?? null;
}
