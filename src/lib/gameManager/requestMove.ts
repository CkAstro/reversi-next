import { getGame } from '@/lib/game/cacheInterface';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';
import { upgradeGame } from '@/lib/gameManager/upgradeGame';

export const requestMove = (
   gameId: Reversi['GameId'],
   playerRole: Reversi['PlayerRole'],
   moveIndex: number,
   callback: (
      error: ServerError | null,
      boardState: Reversi['BoardState'],
      turn: Reversi['PlayerRole'],
      winner: Reversi['PlayerRole'] | 0 | null
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', [], 1, null);
   if (game.status === 'complete' || game.status === 'pending')
      return callback('GAME_NOT_ACTIVE', [], 1, null);

   const validMove = game.placeGamePiece(playerRole, moveIndex);
   if (!validMove) return callback('INVALID_MOVE', [], playerRole, null);

   const boardState = game.getBoardState();
   const turn = game.turn;

   const gameOver = game.isGameOver();
   if (!gameOver) return callback(null, boardState, turn, null);

   upgradeGame(gameId, 'active');
   const [pointsA, pointsB] = game.getScore();
   const winner = pointsB < pointsA ? 1 : pointsA < pointsB ? -1 : 0;

   callback(null, boardState, turn, winner);
};
