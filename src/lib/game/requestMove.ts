import { getGame } from '@/lib/game/gameCache';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';
import type { ServerError } from '@/types/socket';

export const requestMove = (
   gameId: Reversi['GameId'],
   playerRole: Reversi['PlayerRole'],
   moveIndex: number,
   callback: (
      error: ServerError | null,
      boardState: Reversi['BoardState'],
      turn: Reversi['PlayerRole'],
      clients: Client[]
   ) => void
) => {
   const game = getGame(gameId);
   if (game === null) return callback('GAME_NOT_FOUND', [], 1, []);

   const validMove = game.placeGamePiece(playerRole, moveIndex);
   if (!validMove) return callback('INVALID_MOVE', [], playerRole, []);

   const boardState = game.getBoardState();
   const turn = game.turn;
   const clients = game.getAllClients();

   callback(null, boardState, turn, clients);
};
