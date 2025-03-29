import { getSession, verifyUsername } from '@/lib/redis/sessions';
import type { Reversi } from '@/types/reversi';
import type { SocketHandler } from '@/types/socket';

export const setUsername: SocketHandler['set:username'] =
   (client) => async (username: Reversi['Username']) => {
      if (client.game !== null)
         return client.send(
            'server:error',
            'INVALID_USERNAME',
            'Cannot change username while in a active game. Return to lobby.'
         );

      const authKey = client.getAuthKey();
      const validUsername = await verifyUsername(username, authKey);

      if (!validUsername)
         return client.send(
            'server:error',
            'INVALID_USERNAME',
            'Username already taken.'
         );

      const playerId = await getSession(authKey, username);
      client.updateInfo(playerId, username);
   };
