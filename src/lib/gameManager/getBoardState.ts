import { getGame } from '@/lib/game/gameCache';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';

export const getBoardState = (
   gameId: Reversi['GameId'],
   callback: (
      error: ServerError | null,
      boardState: Reversi['BoardState'],
      turn: Reversi['PlayerRole']
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', [], 1);

   callback(null, game.getBoardState(), game.turn);
};
