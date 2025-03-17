import type {
   ReversiBoardState,
   ReversiGameId,
   ReversiPlayer,
} from '@/types/reversi';
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
   role: ReversiPlayer;
   score: number;
}
export interface CompletedGameInfo {
   gameId: ReversiGameId;
   playerA: GamePlayerInfo;
   playerB: GamePlayerInfo;
}
export interface WaitingGameInfo {
   gameId: ReversiGameId;
   playerA: PlayerName;
   playerB: null;
}

export interface RequestPayload {
   'game:join': (gameId: ReversiGameId) => void;
   'game:leave': (gameId: ReversiGameId) => void;
   'game:create': () => void;
   'game:observe': (gameId: ReversiGameId) => void;
   'player:move': (gameId: ReversiGameId, moveIndex: number) => void;
   'get:boardState': (gameId: ReversiGameId) => void;
   'get:games': () => void;
}

export interface GameInfoResponse {
   active: ActiveGameInfo[];
   complete: CompletedGameInfo[];
   waiting: WaitingGameInfo[];
}

export interface ResponsePayload {
   'get:games': (response: GameInfoResponse) => void;
   'get:boardState': (boardState: ReversiBoardState) => void;
   'game:join': (gameId: ReversiGameId) => void;
   'game:leave': (redirect: string) => void;
   'game:over': (message: string) => void;
   'game:update': (response: unknown) => void;
   'server:message': (message: string, error?: string) => void;
}

export type ClientSocket = SocketClient<ResponsePayload, RequestPayload>;
export type ServerSocket = SocketServer<RequestPayload, ResponsePayload>;
export type SocketHandler = {
   [E in keyof RequestPayload]: (socket: ServerSocket) => RequestPayload[E];
};
