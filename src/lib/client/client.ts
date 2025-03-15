import { getCurrentState } from '@/lib/game/gameManager';
import type { WsClient } from '@/types/reversi';
import type { Socket } from 'socket.io';

type AuthId = string;
const clientStore: Record<AuthId, WsClient> = {};

const transferClient = (previous: Socket, current: Socket) => {
   previous.rooms.forEach((room) => {
      previous.leave(room);
      current.join(room);
   });
   previous.disconnect();
};

const authenticate = (client: WsClient) => {
   console.log('attempting authentication');
   const authKey = client.socket.handshake.auth.key;

   if (!authKey) {
      client.socket.emit('auth', 'reject');
      client.socket.disconnect();
   } else if (authKey in clientStore) {
      const previousClient = clientStore[authKey];
      const previousSocket = previousClient.socket;
      Object.assign(previousClient, {
         socketId: client.socketId,
         socket: client.socket,
         isConnected: client.isConnected,
         lastActive: Date.now(),
      });

      transferClient(previousSocket, client.socket);
      client.socket.emit('auth', 'reconnect');
   } else {
      client.authKey = authKey;
      client.lastActive = Date.now();
      clientStore[authKey] = client;
      client.socket.emit('auth', 'accept'); // no actual authentication yet
   }
};

export const initConnection = (socket: WsClient['socket']) => {
   console.log('new client connected', socket.handshake);

   const client: WsClient = {
      socketId: socket.id,
      socket,
      authKey: null,
      isConnected: () => socket.connected,
      lastActive: Date.now(),
      username: null,
      currentGameId: null,
      playerStatus: 'idle',
      opponentId: null,
   };

   socket.removeAllListeners(); // ensure we don't dupe
   authenticate(client);
   socket.on('connection', () => {
      console.log('renewed connection?');
   });

   socket.on('disconnect', (reason) => {
      console.log('client disconnected with reason:', reason);
   });

   const currentLoginState = getCurrentState();
   socket.emit('init', currentLoginState);
};

export const _forTesting = {
   authenticate,
   transferClient,
   clientStore,
};
