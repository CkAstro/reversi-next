import { validateMove } from '@/lib/validateMove';
import { logger } from '@/lib/utils/logger';
import { getGame } from '@/lib/game/gameCache';
import type { Reversi } from '@/types/reversi';

/** request a move for a given player
 * @param gameId id of game
 * @param playerId id of player
 * @param moveIndex board index player wishes to place a piece
 * @param callback { error, BoardState }
 */
export const requestMove = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   moveIndex: number,
   callback: (
      result:
         | { error: string; boardState?: never }
         | { error?: never; boardState: Reversi['BoardState'] }
   ) => void
) => {
   logger(`player ${playerId} requested move ${moveIndex} in game ${gameId}`);
   const game = getGame(gameId);
   if (game === null) return callback({ error: 'Game does not exist.' });

   const playerRole =
      game.playerA?.playerId === playerId
         ? game.playerA.role
         : game.playerB?.playerId === playerId
         ? game.playerB.role
         : null;

   if (playerRole === null)
      return callback({ error: 'Player is not active in this game.' });

   const boardState = validateMove(
      game.boardState,
      playerRole as Reversi['PlayerRole'],
      moveIndex
   );

   if (boardState === null) return callback({ error: 'Move not allowed.' });
   callback({ boardState });
};
