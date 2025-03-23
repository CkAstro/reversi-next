import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function getOpponentByRole(
   this: Game,
   role: Reversi['Role']
): Client | null {
   return role === 1 ? this._playerB : role === -1 ? this._playerA : null;
}
