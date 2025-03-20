import type { Reversi } from '@/types/reversi';
import type { Socket as SocketClient } from 'socket.io-client';
import type { Socket as SocketServer } from 'socket.io';
import type { Client } from '@/lib/client/Client';

export type PlayerName = string;
export interface ActiveGameInfo {
   gameId: string;
   playerA: Reversi['Username'];
   playerB: Reversi['Username'];
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
   player: Reversi['Username'];
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

export type ServerError =
   | 'SOCKET_ERROR'
   | 'GAME_NOT_FOUND'
   | 'GAME_FULL'
   | 'INVALID_MOVE';

export interface ResponsePayload {
   'get:games': (response: GameInfoResponse) => void;
   'get:boardState': (
      boardState: Reversi['BoardState'],
      turn: Reversi['PlayerRole']
   ) => void;
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
   [E in keyof RequestPayload]: (client: Client) => RequestPayload[E];
};

// --- Client Construction --- //
export type ClientStatus = 'active' | 'observing' | 'idle';
