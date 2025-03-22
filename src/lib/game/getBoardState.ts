import type { Game } from '@/lib/game/Game';

export function getBoardState(this: Game) {
   return [...this._boardState];
}
