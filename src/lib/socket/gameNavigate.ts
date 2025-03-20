import { getGame } from '@/lib/game/gameCache';
import type { SocketHandler } from '@/types/socket';

export const gameNavigate: SocketHandler['game:navigate'] =
   (client) => (gameId) => {
      // navigating to a URL should attempt to join a game

      // // console.log('asdf', gameId);

      // // console.log('debug', client.currentGameId);
      // if (gameId === null || gameId === client.currentGameId) return;
      if (gameId === null || gameId === client.game?.gameId) return;

      const game = getGame(gameId);
      if (game === null)
         return client.send(
            'server:error',
            'GAME_NOT_FOUND',
            `Game ${gameId} does not exist.`
         );

      game.addPlayer(client);
      client.send(
         'game:join',
         game.gameId,
         client.role,
         client.opponent?.getUsername()
      );
      game.clientList.forEach((participant) => {
         if (participant.playerId === client.playerId) return;
         participant.send('game:playerJoin', client.getUsername(), client.role);
      });
   };
