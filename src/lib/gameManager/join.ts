import { getGame } from '@/lib/game/gameCache';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';
import { upgradeGame } from '@/lib/gameManager/upgradeGame';

export const join = (
   gameId: Reversi['GameId'],
   client: Client,
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      opponent: Client | null,
      observers: Map<Reversi['PlayerId'], Client> | null,
      gameStart: boolean
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null)
      return callback('GAME_NOT_FOUND', null, null, null, false);

   const role = game.addPlayer(client);
   const opponent = client.opponent;
   const observers = game.getObservers();

   const shouldTriggerStart = game.status === 'pending' && opponent !== null;
   if (shouldTriggerStart) upgradeGame(gameId, 'pending');

   callback(null, role, opponent, observers, shouldTriggerStart);
};
