import { logger } from '@/lib/utils/logger';
import type { Game } from '@/lib/game/Game';

export function startGame(this: Game) {
   if (this._currentStatus !== 'pending')
      return logger(`attempted to start ${this.gameId}, but it is not pending`);

   this._currentStatus = 'active';
   this._startTime = Date.now();
}
