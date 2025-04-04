import type { Reversi } from '@/types/reversi';
import type { Socket as SocketClient } from 'socket.io-client';
import type { Socket as SocketServer } from 'socket.io';
import type { Client } from '@/lib/client/Client';
import type { Server } from 'socket.io';

export type ServerIO = Server<RequestPayload, ResponsePayload>;

export type PlayerName = string;
export interface ActiveGameInfo {
   gameId: string;
   playerA: Reversi['Username'];
   playerB: Reversi['Username'];
   observerCount: number;
}

export interface CompletedGameInfo {
   gameId: Reversi['GameId'];
   playerA: Reversi['Username'];
   playerB: Reversi['Username'];
   score: [number, number];
}

export interface PendingGameInfo {
   gameId: Reversi['GameId'];
   player: Reversi['Username'];
}

export interface GameInfoResponse {
   active: ActiveGameInfo[];
   complete: CompletedGameInfo[];
   pending: PendingGameInfo[];
}

// --- Client-Side Requests --- //

// game namespace
type CreateGameRequest = () => void;
type JoinGameRequest = (gameId: Reversi['GameId']) => void;
type LeaveGameRequest = (gameId: Reversi['GameId']) => void;
type ObserveGameRequest = (gameId: Reversi['GameId']) => void;
type ReplayGameRequest = (gameId: Reversi['GameId']) => void;

// player namespace
type PlayerMoveRequest = (gameId: Reversi['GameId'], moveIndex: number) => void;
type PlayerChatRequest = (
   gameId: Reversi['GameId'] | null,
   message: string
) => void;

// fetch namespace
type FetchLobbyRequest = () => void;
type FetchChatRequest = () => void;
type FetchBoardStateRequest = (gameId: Reversi['GameId']) => void;

// set namespace
type SetUsernameRequest = (username: Reversi['Username']) => void;

export interface RequestPayload {
   // game namespace - client connecting/disconnecting to game
   'game:join': JoinGameRequest;
   'game:leave': LeaveGameRequest;
   'game:create': CreateGameRequest;
   'game:observe': ObserveGameRequest;
   'game:replay': ReplayGameRequest;
   // player namespace - player action within a game
   'player:move': PlayerMoveRequest;
   'player:chat': PlayerChatRequest;
   // fetch namespace - get info from server
   'fetch:lobby': FetchLobbyRequest;
   'fetch:chat': FetchChatRequest;
   'fetch:boardState': FetchBoardStateRequest;
   // set namespace - set client property
   'set:username': SetUsernameRequest;
}

// --- Server-Side Responses --- //

// server namespace
export type ServerError =
   | 'SOCKET_ERROR'
   | 'SERVER_ERROR'
   | 'GAME_NOT_FOUND'
   | 'GAME_NOT_ACTIVE'
   | 'GAME_FULL'
   | 'INVALID_MOVE'
   | 'INVALID_USERNAME';

type ServerMessageResponse = (error: string | null, message: string) => void;
type ServerErrorResponse = (error: ServerError, message: string) => void;

// game namespace
type JoinGameResponse = (
   gameId: Reversi['GameId'],
   role: Reversi['Role'],
   status: Exclude<Reversi['GameStatus'], 'complete'>,
   opponent: Reversi['Username'] | null
) => void;

type LeaveGameResponse = (redirectUrl: string) => void;
type EndGameResponse = (
   boardState: Reversi['BoardState'],
   winner: Reversi['Role']
) => void;

type UserJoinResponse = (
   username: Reversi['Username'],
   role: Reversi['Role']
) => void;

type UserLeaveResponse = (
   username: Reversi['Username'],
   role: Reversi['Role']
) => void;

// update namespace
export type AddedGame =
   | { type: Extract<Reversi['GameStatus'], 'pending'>; game: PendingGameInfo }
   | { type: Extract<Reversi['GameStatus'], 'active'>; game: ActiveGameInfo }
   | { type: Extract<Reversi['GameStatus'], 'replay'>; game: ActiveGameInfo }
   | {
        type: Extract<Reversi['GameStatus'], 'complete'>;
        game: CompletedGameInfo;
     };
export interface RemovedGame {
   type: Reversi['GameStatus'];
   gameId: Reversi['GameId'];
}

type UpdateLobbyResponse = (added: AddedGame[], removed: RemovedGame[]) => void;

type UpdateChatResponse = (
   username: Reversi['Username'],
   messageId: string,
   message: string
) => void;

type UpdateBoardStateResponse = (
   changes: { index: number; role: Reversi['PlayerRole'] }[],
   turn: Reversi['PlayerRole']
) => void;

// fetch namespace
type FetchLobbyResponse = (response: GameInfoResponse) => void;
type FetchChatResponse = () => void;

type FetchBoardStateResponse = (
   boardState: Reversi['BoardState'],
   turn: Reversi['PlayerRole']
) => void;

// set namespace
type SetUsernameResponse = (playerId: Reversi['PlayerId']) => void;

export interface ResponsePayload {
   // server namespace - direct server response
   'server:message': ServerMessageResponse;
   'server:error': ServerErrorResponse;
   // game namespace - server updating client about game status
   'game:join': JoinGameResponse;
   'game:leave': LeaveGameResponse;
   'game:end': EndGameResponse;
   'game:userJoin': UserJoinResponse;
   'game:userLeave': UserLeaveResponse;
   // update namespace - partial state update
   'update:lobby': UpdateLobbyResponse;
   'update:chat': UpdateChatResponse;
   'update:boardState': UpdateBoardStateResponse;
   // fetch namespace - full state update
   'fetch:lobby': FetchLobbyResponse;
   'fetch:chat': FetchChatResponse;
   'fetch:boardState': FetchBoardStateResponse;
   // set namespace - confirm client property
   'set:username': SetUsernameResponse;
}

// --- Socket.io Objects --- //
export type ClientSocket = SocketClient<ResponsePayload, RequestPayload>;
export type ServerSocket = SocketServer<RequestPayload, ResponsePayload>;

type UpgradeEvent = Extract<
   keyof RequestPayload,
   'game:join' | 'game:create' | 'game:replay' | 'player:move'
>;
export type SocketHandler = {
   [E in keyof RequestPayload]: E extends UpgradeEvent
      ? (client: Client, io: ServerIO) => RequestPayload[E]
      : (client: Client) => RequestPayload[E];
};

// --- Client Construction --- //
export type ClientStatus = 'active' | 'observing' | 'idle';
