import { sessions } from '@/lib/socket/sessionStore';
import type { Reversi } from '@/types/reversi';
import type { ResponsePayload, ServerSocket, WsClient } from '@/types/socket';

const clientStore: Record<Reversi['PlayerId'], WsClient> = {};

const refreshClient = (playerId: Reversi['PlayerId'], socket: ServerSocket) => {
   const client = clientStore[playerId];
   client.socket = socket;
   client.lastActive = Date.now();
};

const createClient = (
   playerId: Reversi['PlayerId'],
   username: string,
   authKey: string,
   socket: ServerSocket
) => {
   const client: WsClient = {
      playerId,
      username,
      authKey,
      lastActive: Date.now(),
      currentGameId: null,
      currentRole: null,
      opponentId: null,
      status: 'idle',
      socket,
      send: socket.emit,
   };

   clientStore[playerId] = client;
};

type AllowedUpdates = Partial<
   Pick<WsClient, 'currentGameId' | 'currentRole' | 'opponentId' | 'status'>
>;
const updateClient = (
   playerId: Reversi['PlayerId'],
   update: AllowedUpdates
) => {
   const client = getClient(playerId);
   if (client === null) return;

   if (update.currentGameId !== undefined)
      client.currentGameId = update.currentGameId;
   if (update.currentRole !== undefined)
      client.currentRole = update.currentRole;
   if (update.opponentId !== undefined) client.opponentId = update.opponentId;
   if (update.status !== undefined) client.status = update.status;
   client.lastActive = Date.now();
};

const initClient = (socket: ServerSocket) => {
   const { key: authKey, username = '' } = socket.handshake.auth;
   const playerId = sessions.get(authKey, username);

   if (playerId in clientStore) refreshClient(playerId, socket);
   else createClient(playerId, username, authKey, socket);

   return clientStore[playerId];
};

const getClient = (playerId: Reversi['PlayerId']): WsClient | null => {
   if (playerId in clientStore) return clientStore[playerId];
   return null;
};

const assignOpponent = (
   playerId: Reversi['PlayerId'] | null,
   opponentId: Reversi['PlayerId'] | null
) => {
   if (playerId !== null && playerId in clientStore)
      clientStore[playerId].opponentId = opponentId;
};

const getOpponent = (playerId: Reversi['PlayerId']): WsClient | null => {
   const client = getClient(playerId);
   if (client === null || client.opponentId === null) return null;

   return getClient(client.opponentId);
};

const send = <E extends keyof ResponsePayload>(
   playerId: Reversi['PlayerId'],
   event: E,
   ...payload: Parameters<ResponsePayload[E]>
) => {
   const client = getClient(playerId);
   if (client === null) return;

   client.socket.emit(event, ...payload);
};

const sendOpponent = <E extends keyof ResponsePayload>(
   playerId: Reversi['PlayerId'],
   event: E,
   ...payload: Parameters<ResponsePayload[E]>
) => {
   const client = getClient(playerId);
   if (client === null || client.opponentId === null) return;

   const opponent = getClient(client.opponentId);
   if (opponent === null) return;

   opponent.socket.emit(event, ...payload);
};

const broadcast = <E extends keyof ResponsePayload>(
   playerIdList: Reversi['PlayerId'][],
   event: E,
   ...payload: Parameters<ResponsePayload[E]>
) => {
   playerIdList.forEach((playerId) => send(playerId, event, ...payload));
};

export const clientManager = {
   initClient,
   updateClient,
   getClient,
   assignOpponent,
   getOpponent,
   send,
   sendOpponent,
   broadcast,
};
