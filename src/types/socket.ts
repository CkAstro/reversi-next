import type { ReversiPlayer } from '@/types/reversi';
import type { Socket as SocketClient } from 'socket.io-client';
// import type { Socket as SocketServer} from 'socket.io';

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
   gameId: string;
   playerA: GamePlayerInfo;
   playerB: GamePlayerInfo;
}
export interface WaitingGameInfo {
   gameId: string;
   playerA: PlayerName;
   playerB: null;
}

export interface InitResponse {
   active: ActiveGameInfo[];
   complete: CompletedGameInfo[];
   waiting: WaitingGameInfo[];
}

export interface ResponsePayload {
   init: (response: InitResponse) => void;
   boardState: (response: string) => void;
}

export interface RequestPayload {
   init: InitResponse;
}

export type ClientSocket = SocketClient<ResponsePayload, RequestPayload>;
