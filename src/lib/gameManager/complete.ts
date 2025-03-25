import { getGame } from '@/lib/game/gameCache';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { ReversiGame } from '@/lib/mongodb/reversiGame';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

export const complete = (gameId: Reversi['GameId']) => {
   const game = getGame(gameId);
   if (game === null) return;

   const [playerA, playerB] = game.getPlayers();
   if (playerA === null || playerB === null)
      return logger(
         `something went wrong completing game ${gameId}: one or more players is missing`
      );

   game.completeGame();
   const [pointsA, pointsB] = game.getScore();
   const winner = pointsB < pointsA ? 1 : pointsA < pointsB ? -1 : 0;

   connectToDatabase();
   const completedGame = new ReversiGame({
      gameId: game.gameId,
      moveHistory: game.getReducedHistory(),
      finalState: game.getBoardState(),
      playerA,
      playerB,
      firstTurn: game.firstTurn,
      winner,
      score: [pointsA, pointsB],
      startTime: game.startTime,
      endTime: game.endTime,
   });

   completedGame.save().then(() => {
      logger(`game ${gameId} successfully saved to database`);
   });
};
