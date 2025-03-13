import type { ReversiBoardState, ReversiPlayer } from '@/types/reversi';

export const parseBoardState = (serializedState: string): ReversiBoardState =>
   serializedState.split(',').map((square) => {
      if (square === '') return null;
      return parseInt(square) as ReversiPlayer;
   });
