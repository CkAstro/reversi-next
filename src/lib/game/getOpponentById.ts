import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function getOpponentById(
   this: Game,
   playerId: Reversi['PlayerId']
): Client | null {
   return this._playerA?.playerId === playerId
      ? this._playerB
      : this._playerB?.playerId === playerId
      ? this._playerA
      : null;
}
