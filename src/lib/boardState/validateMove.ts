import { getStateFlips } from '@/lib/boardState/getStateFlips';

type GamePieceState = 1 | -1 | null;

const updateGameState = (
   boardState: GamePieceState[],
   flips: number[],
   moveIndex: number,
   player: 1 | -1
) => {
   const updatedState = [...boardState];
   updatedState[moveIndex] = player;
   flips.forEach((index) => {
      updatedState[index] = player;
   });

   return updatedState;
};

const handleFirstFourRounds = (
   boardState: GamePieceState[],
   moveIndex: number,
   player: 1 | -1
) => {
   if (
      moveIndex !== 27 &&
      moveIndex !== 28 &&
      moveIndex !== 35 &&
      moveIndex !== 36
   )
      return null;

   return updateGameState(boardState, [], moveIndex, player);
};

export const validateMove = (
   boardState: GamePieceState[],
   moveIndex: number,
   player: 1 | -1,
   round: number
) => {
   if (round < 4) return handleFirstFourRounds(boardState, moveIndex, player);
   const flips = getStateFlips(boardState, player, moveIndex);
   if (flips.length === 0) return null;
   return updateGameState(boardState, flips, moveIndex, player);
};

export const _forTesting = {
   handleFirstFourRounds,
   updateGameState,
};
