import { getGame } from '@/lib/game/gameCache';
import type { Reversi } from '@/types/reversi';

export const getRoleByPlayerId = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId']
): Reversi['Role'] => {
   const game = getGame(gameId);
   if (game === null) return null;

   if (game.playerA?.playerId === playerId) return game.playerA.role;
   if (game.playerB?.playerId === playerId) return game.playerB.role;
   for (const { playerId: pId } of game.observers) {
      if (pId === playerId) return 0;
   }

   return null;
};
