import type { Game } from '@/lib/game/Game';
import { validateMove } from '@/lib/boardState/validateMove';
import type { Reversi } from '@/types/reversi';

export function placeGamePiece(
   this: Game,
   role: Reversi['Role'],
   moveIndex: number
): boolean {
   if (role !== this._currentTurn) return false;

   const nextBoardState = validateMove(
      this._boardState,
      moveIndex,
      this._currentTurn,
      this._currentRound
   );

   if (nextBoardState === null) return false;
   this._boardState = nextBoardState;
   this._currentTurn = -this._currentTurn as Reversi['PlayerRole'];
   this._currentRound++;
   this._moveHistory.push({ player: role, move: moveIndex });
   return true;
}
