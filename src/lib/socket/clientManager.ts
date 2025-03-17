import type { Reversi } from '@/types/reversi';
import type { ResponsePayload, ServerSocket, WsClient } from '@/types/socket';

const clientStore: Record<Reversi['PlayerId'], WsClient> = {};

const createClient = (socket: ServerSocket): WsClient => ({
   playerId: socket.id,
   socket,
   authKey: socket.handshake.auth.key,
   lastActive: Date.now(),
   username: null,
   currentGameId: null,
   playerStatus: 'idle',
   opponentId: null,
});

const registerClient = (socket: ServerSocket): WsClient => {
   const client = createClient(socket);
   clientStore[socket.id] = client;

   return client;
};

const getClient = (clientId: Reversi['PlayerId']): WsClient | null => {
   if (!(clientId in clientStore)) return null;
   return clientStore[clientId];
};

const getOpponent = (clientId: Reversi['PlayerId']): WsClient | null => {
   if (!(clientId in clientStore)) return null;
   const client = clientStore[clientId];
   if (client.opponentId === null || !(client.opponentId in clientStore))
      return null;

   const opponent = clientStore[client.opponentId];
   return opponent;
};

const getOpponentId = (
   clientId: Reversi['PlayerId']
): Reversi['PlayerId'] | null => {
   return getOpponent(clientId)?.playerId ?? null;
};

const send = <E extends keyof ResponsePayload>(
   clientId: Reversi['PlayerId'],
   event: E,
   ...payload: Parameters<ResponsePayload[E]>
) => {
   const client = getClient(clientId);
   if (client === null) return;

   client.socket.emit(event, ...payload);
};

const sendMulti = <E extends keyof ResponsePayload>(
   clientIds: Reversi['PlayerId'][],
   event: E,
   ...payload: Parameters<ResponsePayload[E]>
) => {
   clientIds.forEach((clientId) => send(clientId, event, ...payload));
};

export const clientManager = {
   registerClient,
   getClient,
   getOpponent,
   getOpponentId,
   send,
   sendMulti,
};
