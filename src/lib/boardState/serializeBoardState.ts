import type { ReversiBoardState } from '@/types/reversi';

export const serializeBoardState = (boardState: ReversiBoardState): string =>
   boardState
      .map((square) => {
         if (square === null) return '';
         return square;
      })
      .join(',');
