import { logger } from '@/lib/utils/logger';
import type { Game } from '@/lib/game/Game';

export function completeGame(this: Game) {
   if (this._currentStatus !== 'active')
      return logger(
         `attempted to complete ${this.gameId}, but it is not active`
      );

   this._currentStatus = 'complete';
   this._endTime = Date.now();
}
