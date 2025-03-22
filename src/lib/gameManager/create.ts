import { createGame } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

export const create = (
   client: Client,
   callback: (gameId: Reversi['GameId'], role: Reversi['Role']) => void
) => {
   const game = createGame(client);
   const gameId = game.gameId;
   const role = game.getRoleById(client.playerId);

   callback(gameId, role);
};
