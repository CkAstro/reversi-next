import type { Reversi } from '@/types/reversi';
import type { Socket as SocketClient } from 'socket.io-client';
import type { Socket as SocketServer } from 'socket.io';

export type PlayerName = string;
export interface ActiveGameInfo {
   gameId: string;
   playerA: PlayerName;
   playerB: PlayerName;
   observerCount: number;
}

interface GamePlayerInfo {
   name: PlayerName;
   role: Reversi['PlayerRole'];
   score: number;
}
export interface CompletedGameInfo {
   gameId: Reversi['GameId'];
   playerA: GamePlayerInfo;
   playerB: GamePlayerInfo;
}
export interface PendingGameInfo {
   gameId: Reversi['GameId'];
   playerA: PlayerName;
   playerB: PlayerName | null;
}

export interface RequestPayload {
   'game:join': (gameId: Reversi['GameId']) => void;
   'game:leave': (gameId: Reversi['GameId']) => void;
   'game:create': () => void;
   'game:observe': (gameId: Reversi['GameId']) => void;
   'game:navigate': (gameId: Reversi['GameId'] | null) => void;
   'player:move': (gameId: Reversi['GameId'], moveIndex: number) => void;
   'get:boardState': (gameId: Reversi['GameId']) => void;
   'get:games': () => void;
}

export interface GameInfoResponse {
   active: ActiveGameInfo[];
   complete: CompletedGameInfo[];
   pending: PendingGameInfo[];
}

export const serverErrors = { GAME_NOT_FOUND: 0 };
export type ServerError = keyof typeof serverErrors;

export interface ResponsePayload {
   'get:games': (response: GameInfoResponse) => void;
   'get:boardState': (boardState: Reversi['BoardState']) => void;
   'game:join': (
      gameId: Reversi['GameId'],
      role: Reversi['Role'],
      opponentId?: Reversi['PlayerId']
   ) => void;
   'game:leave': (redirect: string) => void;
   'game:over': (message: string) => void;
   'game:playerJoin': (username: string, role: Reversi['Role']) => void;
   'game:playerLeave': (username: string, role: Reversi['Role']) => void;
   'game:update': (response: unknown) => void;
   'server:message': (message: string, error?: string) => void;
   'server:error': (error: ServerError, message: string) => void;
}

export type ClientSocket = SocketClient<ResponsePayload, RequestPayload>;
export type ServerSocket = SocketServer<RequestPayload, ResponsePayload>;
export type SocketHandler = {
   [E in keyof RequestPayload]: (client: WsClient) => RequestPayload[E];
};

// --- Client Construction --- //
type AuthKey = string;
export type ClientStatus = 'active' | 'observing' | 'idle';

export interface WsClient {
   playerId: Reversi['PlayerId'];
   username: Reversi['Username'];
   authKey: AuthKey;
   lastActive: number;
   currentGameId: Reversi['GameId'] | null;
   currentRole: Reversi['Role'];
   opponentId: Reversi['PlayerId'] | null;
   status: ClientStatus;
   socket: ServerSocket;
   send: ServerSocket['emit'];
}
