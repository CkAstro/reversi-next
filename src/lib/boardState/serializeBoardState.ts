import type { Reversi } from '@/types/reversi';

export const serializeBoardState = (
   boardState: Reversi['BoardState']
): string =>
   boardState
      .map((square) => {
         if (square === null) return '';
         return square;
      })
      .join(',');
