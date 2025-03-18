import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

/** assign player to game
 * @param game the game object to add
 * @param firstSlot add to first or second slot?
 * @param playerId id of player
 * @param username username of player
 * @returns player role
 */
const assignPlayerToGame = (
   game: Reversi['Game'],
   firstSlot: boolean,
   playerId: Reversi['PlayerId'],
   username: Reversi['PlayerInfo']['username']
): Reversi['PlayerRole'] => {
   const slot = firstSlot ? 'playerA' : 'playerB';
   const opponent = firstSlot ? 'playerB' : 'playerA';
   const role = -(game[opponent]?.role ?? -1) as 1 | -1;
   game[slot] = {
      playerId,
      username,
      role,
   };
   logger(`player ${playerId} has been assigned to game ${game.gameId}`);

   return game[slot].role as Reversi['PlayerRole'];
};

/** add player to game
 * @param gameId id of game
 * @param playerId id of player
 * @param callback { error, role, opponentId }
 */
export const addPlayer = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   callback: (
      result:
         | { error: string; role?: never; opponentId?: never }
         | {
              error?: never;
              role: Reversi['PlayerRole'];
              opponentId: Reversi['PlayerId'];
           }
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback({ error: 'Game does not exist.' });

   const { playerA, playerB } = game;
   if (playerA !== null && playerB !== null)
      return callback({ error: 'Game is full.' });

   const firstSlotIsEmpty = game.playerA === null;
   const role = assignPlayerToGame(
      game,
      firstSlotIsEmpty,
      playerId,
      'no username'
   );

   const opponentId = firstSlotIsEmpty
      ? game.playerB!.playerId
      : game.playerA!.playerId;

   callback({ role, opponentId });
};

export const _forTesting = {
   assignPlayerToGame,
};
