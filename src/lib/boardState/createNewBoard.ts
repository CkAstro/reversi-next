import type { Reversi } from '@/types/reversi';

const newBoardState: Reversi['BoardState'] = Array.from(
   { length: 64 },
   () => null
);
export const createNewBoard = () => [...newBoardState];
