import { create } from 'zustand';
import type { Reversi } from '@/types/reversi';
import type { ResponsePayload } from '@/types/socket';

type GameStatus = Exclude<Reversi['GameStatus'], 'complete'>;
interface GameState {
   gameId: Reversi['GameId'] | null;
   gameStatus: GameStatus | null;
   boardState: Reversi['BoardState'];
   role: Reversi['Role'];
   turn: Reversi['PlayerRole'] | null;
   opponent: Reversi['Username'] | null;
   observers: Reversi['Username'][];
   winner: Reversi['Role'];
   joinGame: ResponsePayload['game:join'];
   leaveGame: ResponsePayload['game:leave'];
   endGame: ResponsePayload['game:end'];
   setBoardState: ResponsePayload['fetch:boardState'];
   updateBoardState: ResponsePayload['update:boardState'];
   setOpponent: (username: Reversi['Username']) => void;
   addObserver: (username: Reversi['Username']) => void;
   removeObserver: (username: Reversi['Username']) => void;
}

const defaultBoardState = Array.from({ length: 64 }, () => null);
export const gameStore = create<GameState>((set, get) => ({
   gameId: null,
   gameStatus: null,
   boardState: [...defaultBoardState],
   role: null,
   turn: null,
   opponent: null,
   observers: [],
   winner: null,
   joinGame: (gameId, role, gameStatus, opponent) => {
      set({
         gameId,
         role,
         gameStatus,
         opponent,
      });
   },
   leaveGame: (_redirectUrl) => {
      set({
         gameId: null,
         gameStatus: null,
         boardState: [...defaultBoardState],
         role: null,
         opponent: null,
         observers: [],
      });
   },
   endGame: (boardState, winner) => {
      set({ boardState, winner });
   },
   setBoardState: (boardState, turn) => {
      set({ boardState, turn });
   },
   updateBoardState: (changes, turn) => {
      const currentState = get().boardState;
      const updatedState = [...currentState];
      changes.forEach(({ index, role }) => {
         updatedState[index] = role;
      });
      set({ boardState: updatedState, turn });
   },
   setOpponent: (username) => {
      set({ opponent: username });
   },
   addObserver: (username) => {
      const observers = get().observers;
      if (!observers.includes(username))
         set({ observers: [...observers, username] });
   },
   removeObserver: (username) => {
      const observers = get().observers;
      const updatedObservers = observers.filter((o) => o !== username);
      set({ observers: updatedObservers });
   },
}));
