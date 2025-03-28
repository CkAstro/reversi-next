import { isValidateMove } from '@/lib/boardState/validateMove';
import type { Game } from '@/lib/game/Game';

export function isGameOver(this: Game) {
   if (this._currentRound < 4) return false;
   const turn = this._currentTurn;

   for (let ind = 0; ind < 64; ind++) {
      if (
         this._boardState[ind] === null &&
         isValidateMove(this._boardState, ind, turn)
      )
         return false;
   }

   return true;
}
