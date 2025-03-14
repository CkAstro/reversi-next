import type { WsClient } from '@/types/reversi';

type AuthId = string;
const clientStore: Record<AuthId, WsClient> = {};

const authenticate = (client: WsClient) => {
   // const authKey = req; // this will be an object at some point
   console.log('attempting authentication');
   const authKey = client.socket.handshake.auth.key;

   if (authKey in clientStore) {
      const previousConnection = clientStore[authKey];
      // const previousSocket = previousConnection.socket;
      Object.assign(previousConnection, {
         socketId: client.socketId,
         socket: client.socket,
         isConnected: client.isConnected,
         lastActive: Date.now(),
      });
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

   const timeout = setInterval(() => {
      console.log('connected?', socket.connected);

      if (!socket.connected) clearInterval(timeout);
      socket.emit('ping', 'ping');
   }, 2000);
};
