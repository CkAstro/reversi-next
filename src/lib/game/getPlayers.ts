import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function getPlayers(
   this: Game
): [Reversi['Username'] | null, Reversi['Username'] | null] {
   return [this._playerA?.username ?? null, this._playerB?.username ?? null];
}
