export type ReversiPlayer = 1 | -1;
export type ReversiPlayerId = string;
export type ReversiGameId = string;
export type ReversiSquareState = ReversiPlayer | null;
export type ReversiBoardState = ReversiSquareState[];
export interface ReversiPlayerMove {
   player: ReversiPlayer;
   move: number;
}

export type ReversiPlayerRole = 'player1' | 'player2' | 'observer';
export type ReversiGameStatus = 'active' | 'waiting' | 'replay' | 'complete';
export interface ReversiGame {
   gameId: ReversiGameId;
   boardState: ReversiBoardState;
   moveHistory: ReversiPlayerMove[];
   turn: ReversiPlayer;
   gameStatus: ReversiGameStatus;
   playerId1: ReversiPlayerId | null;
   playerId2: ReversiPlayerId | null;
   observerIds: ReversiPlayerId[];
}

import type { Socket } from 'socket.io';

interface SocketInformation {
   socketId: string;
   socket: Socket;
   connectionIp: string;
   isConnected: boolean;
   lastActive: number;
}

type ReversiPlayerStatus = 'playing' | 'observing' | 'idle';
interface PlayerInformation {
   username: string;
   playerId: ReversiPlayerId;
   currentGameId: ReversiGame['gameId'];
   playerStatus: ReversiPlayerStatus;
   opponentId: ReversiPlayerId | null;
}

export type WsClient = SocketInformation & PlayerInformation;
