import { getGame } from '@/lib/game/cacheInterface';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';

export const leave = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', null, null, null);

   const opponent = game.getOpponentById(playerId);
   const role = game.removePlayer(playerId);
   const observers = game.getObservers();

   callback(null, role, opponent, observers);
};
