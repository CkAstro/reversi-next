import { createNewBoard } from '@/lib/boardState/createNewBoard';
import { addPendingGame } from '@/lib/game/gameCache';
import { getRandomId } from '@/lib/utils/getRandomId';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

/** create a new game
 * @param playerId id of initial player
 * @param callback { error, gameId, role }
 */
export const createGame = (
   playerId: Reversi['PlayerId'],
   callback: (
      result:
         | { error: string; gameId: never; role: never }
         | {
              error?: never;
              gameId: Reversi['GameId'];
              role: Reversi['PlayerRole'];
           }
   ) => void
) => {
   const playerRole: Reversi['PlayerRole'] = Math.random() < 0.5 ? 1 : -1;
   const playerInfo: Reversi['PlayerInfo'] = {
      playerId,
      username: 'no username',
      role: playerRole,
   };

   const gameId: Reversi['GameId'] = getRandomId();
   const boardState = createNewBoard();
   const moveHistory: Reversi['PlayerMove'][] = [];
   const turn: Reversi['PlayerRole'] = Math.random() < 0.5 ? 1 : -1;
   const gameStatus: Reversi['GameStatus'] = 'waiting';
   const playerA: Reversi['PlayerInfo'] | null = playerInfo;
   const playerB: Reversi['PlayerInfo'] | null = null;
   const observers: Reversi['PlayerInfo'][] = [];

   const game = {
      gameId,
      boardState,
      moveHistory,
      turn,
      gameStatus,
      playerA,
      playerB,
      observers,
   };

   addPendingGame(game);
   callback({ gameId, role: playerRole });
   logger(`player ${playerId} has created game ${game.gameId}`);
};
