import { getStateFlips } from '@/lib/getStateFlips';

type GamePieceState = 1 | -1 | null;

let turn: 1 | -1 = 1;
const setTurn = (player: 1 | -1) => {
   turn = player;
};
const getTurn = () => turn;

let round = 0;
const setRound = (value: number) => {
   round = value;
};
const getRound = () => round;

const updateGameState = (
   gameState: GamePieceState[],
   flips: number[],
   moveIndex: number,
   player: 1 | -1
) => {
   const updatedState = [...gameState];
   updatedState[moveIndex] = player;
   flips.forEach((index) => {
      updatedState[index] = player;
   });

   return updatedState;
};

const handleFirstFourRounds = (
   gameState: GamePieceState[],
   moveIndex: number,
   player: 1 | -1
) => {
   if (turn !== player) return null;
   if (
      moveIndex !== 27 &&
      moveIndex !== 28 &&
      moveIndex !== 35 &&
      moveIndex !== 36
   )
      return null;

   turn = -turn as 1 | -1;
   round++;
   return updateGameState(gameState, [], moveIndex, player);
};

export const validateMove = (
   gameState: GamePieceState[],
   player: 1 | -1,
   moveIndex: number
) => {
   // player can move in first 3
   if (round < 4) return handleFirstFourRounds(gameState, moveIndex, player);

   if (turn !== player) return null;

   const flips = getStateFlips(gameState, player, moveIndex);
   if (flips.length === 0) return null;
   // return flips;

   turn = -turn as 1 | -1;
   round++;
   return updateGameState(gameState, flips, moveIndex, player);
};

export const _forTesting = {
   getTurn,
   setTurn,
   getRound,
   setRound,
   handleFirstFourRounds,
   updateGameState,
};
