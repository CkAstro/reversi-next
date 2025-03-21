import { getGame } from '@/lib/game/gameCache';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';

export const join = (
   gameId: Reversi['GameId'],
   client: Client,
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', null, null, null);

   const role = game.addPlayer(client);
   const opponent = client.opponent;
   const observers = game.getObservers();
   callback(null, role, opponent, observers);
};
