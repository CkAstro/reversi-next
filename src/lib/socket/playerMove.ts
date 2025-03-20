import { getGame } from '@/lib/game/gameCache';
import { logger } from '@/lib/utils/logger';
import type { SocketHandler } from '@/types/socket';

export const playerMove: SocketHandler['player:move'] =
   (client) => (gameId, moveIndex) => {
      const game = getGame(gameId);
      if (game === null) {
         client.send(
            'server:error',
            'GAME_NOT_FOUND',
            `Failed to find game ${gameId}.`
         );
         logger(
            `failed to apply move from player ${client.playerId} - game ${gameId} (GAME_NOT_FOUND)`
         );
         return;
      }

      const validMove = game.placeGamePiece(client.getCurrentRole(), moveIndex);
      if (!validMove) {
         client.send('server:error', 'INVALID_MOVE', 'Move not allowed.');
         logger(
            `rejected move ${moveIndex} from player ${client.playerId} - game ${gameId} (INVALID_MOVE)`
         );
         return;
      }

      const boardState = game.getBoardState();
      game.getAllClients().forEach((member) => {
         member.send('get:boardState', boardState, game.turn);
      });

      logger(
         `player ${
            client.playerId
         } move ${moveIndex} - game ${gameId} (role ${client.getCurrentRole()})`
      );
   };
