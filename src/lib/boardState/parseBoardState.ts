import type { Reversi } from '@/types/reversi';

export const parseBoardState = (
   serializedState: string
): Reversi['BoardState'] =>
   serializedState.split(',').map((square) => {
      if (square === '') return null;
      return parseInt(square) as Reversi['PlayerRole'];
   });
