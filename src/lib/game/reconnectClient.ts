import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

export const reconnectClient = (
   gameId: Reversi['GameId'],
   playerId: Reversi['PlayerId'],
   role: Reversi['Role']
) => {
   if (role === null) return;

   const game = getGame(gameId);
   if (role === 0)
      game?.observers.push({ playerId, username: 'no username', role });
   if (game?.playerA?.role !== role && game?.playerB?.role !== role) return;

   if (game.playerA?.role === role) game.playerA.playerId = playerId;
   if (game.playerB?.role === role) game.playerB.playerId = playerId;
   logger(`reconnected client ${playerId} to game ${gameId} (role: ${role})`);
};
