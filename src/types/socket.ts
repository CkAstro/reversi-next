import type { Reversi } from '@/types/reversi';
import type { Socket as SocketClient } from 'socket.io-client';
import type { Socket as SocketServer } from 'socket.io';
import type { Socket } from 'socket.io';

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
export interface WaitingGameInfo {
   gameId: Reversi['GameId'];
   playerA: PlayerName;
   playerB: null;
}

export interface RequestPayload {
   'game:join': (gameId: Reversi['GameId']) => void;
   'game:leave': (gameId: Reversi['GameId']) => void;
   'game:create': () => void;
   'game:observe': (gameId: Reversi['GameId']) => void;
   'player:move': (gameId: Reversi['GameId'], moveIndex: number) => void;
   'get:boardState': (gameId: Reversi['GameId']) => void;
   'get:games': () => void;
}

export interface GameInfoResponse {
   active: ActiveGameInfo[];
   complete: CompletedGameInfo[];
   waiting: WaitingGameInfo[];
}

export interface ResponsePayload {
   'get:games': (response: GameInfoResponse) => void;
   'get:boardState': (boardState: Reversi['BoardState']) => void;
   'game:join': (
      gameId: Reversi['GameId'],
      role: Reversi['PlayerRole'],
      opponentId?: Reversi['PlayerId']
   ) => void;
   'game:leave': (redirect: string) => void;
   'game:over': (message: string) => void;
   'game:update': (response: unknown) => void;
   'server:message': (message: string, error?: string) => void;
}

export type ClientSocket = SocketClient<ResponsePayload, RequestPayload>;
export type ServerSocket = SocketServer<RequestPayload, ResponsePayload>;
export type SocketHandler = {
   [E in keyof RequestPayload]: (client: WsClient) => RequestPayload[E];
};

// ---

interface SocketInformation {
   playerId: string;
   socket: Socket;
   authKey: string | null;
   lastActive: number;
}

type ReversiPlayerStatus = 'playing' | 'observing' | 'idle';
interface PlayerInformation {
   username: string | null;
   currentGameId: Reversi['GameId'] | null;
   playerStatus: ReversiPlayerStatus;
   opponentId: Reversi['PlayerId'] | null;
}

export type WsClient = SocketInformation & PlayerInformation;
