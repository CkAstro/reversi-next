import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

export function getRoleById(this: Game, playerId: Reversi['PlayerId']) {
   if (this._playerA?.playerId === playerId) return 1;
   if (this._playerB?.playerId === playerId) return -1;
   if (this._observers.get(playerId)) return 0;
   return null;
}
