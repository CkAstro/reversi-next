import type { ReversiBoardState } from '@/types/reversi';

const newBoardState: ReversiBoardState = Array.from({ length: 64 }, () => null);
export const createNewBoard = () => [...newBoardState];
