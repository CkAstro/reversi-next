type PlayerRole = 1 | -1;
type ObserverRole = 0;
type Role = PlayerRole | ObserverRole;
type PlayerId = string;
type PlayerName = string;
type GameId = string;
type SquareState = PlayerRole | null;
type BoardState = SquareState[];
interface PlayerMove {
   player: PlayerRole;
   move: number;
}
interface PlayerInfo {
   playerId: PlayerId;
   username: PlayerName;
   role: Role;
}

type GameStatus = 'active' | 'waiting' | 'replay' | 'complete';
interface Game {
   gameId: GameId;
   boardState: BoardState;
   moveHistory: PlayerMove[];
   turn: PlayerRole;
   gameStatus: GameStatus;
   playerA: PlayerInfo | null;
   playerB: PlayerInfo | null;
   observers: PlayerInfo[];
}

export interface Reversi {
   PlayerRole: PlayerRole;
   ObserverRole: ObserverRole;
   Role: Role;
   PlayerId: PlayerId;
   GameId: GameId;
   SquareState: SquareState;
   BoardState: BoardState;
   PlayerMove: PlayerMove;
   PlayerInfo: PlayerInfo;
   GameStatus: GameStatus;
   Game: Game;
}
