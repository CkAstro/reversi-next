type PlayerRole = 1 | -1;
type ObserverRole = 0;
type NullRole = null;
type Role = PlayerRole | ObserverRole | NullRole;

type PlayerId = string;
type Username = string;
type GameId = string;
type SquareState = PlayerRole | null;
type BoardState = SquareState[];
interface PlayerMove {
   player: PlayerRole;
   move: number;
}
interface PlayerInfo {
   playerId: PlayerId;
   username: Username;
   role: Role;
}

type GameStatus = 'active' | 'pending' | 'replay' | 'complete';
interface Game {
   gameId: GameId;
   boardState: BoardState;
   moveHistory: PlayerMove[];
   turn: PlayerRole;
   gameStatus: GameStatus;
   playerA: PlayerId | null;
   playerB: PlayerId | null;
   observers: PlayerId[];
}

export interface Reversi {
   PlayerRole: PlayerRole;
   ObserverRole: ObserverRole;
   Role: Role;
   PlayerId: PlayerId;
   Username: Username;
   GameId: GameId;
   SquareState: SquareState;
   BoardState: BoardState;
   PlayerMove: PlayerMove;
   PlayerInfo: PlayerInfo;
   GameStatus: GameStatus;
   Game: Game;
}
