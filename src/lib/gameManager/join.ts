import { getGame } from '@/lib/game/cacheInterface';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';
import { upgradeGame } from '@/lib/gameManager/upgradeGame';

type JoinGameStatus = Exclude<Reversi['GameStatus'], 'complete'>;
export const join = (
   gameId: Reversi['GameId'],
   client: Client,
   callback: (
      error: ServerError | null,
      role: Reversi['Role'],
      status: JoinGameStatus,
      opponent: Client | null,
      gameStart: boolean
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null)
      return callback('GAME_NOT_FOUND', null, 'pending', null, false);

   const role = game.addPlayer(client);
   const opponent = client.opponent;

   const shouldTriggerStart = game.status === 'pending' && opponent !== null;
   if (shouldTriggerStart) upgradeGame(gameId, 'pending');

   callback(
      null,
      role,
      game.status as JoinGameStatus,
      opponent,
      shouldTriggerStart
   );
};
