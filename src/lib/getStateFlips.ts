// cspell:words incrementors

type GamePieceState = 1 | -1 | null;

const isUp = (direction: number) => direction < 3;
const isDown = (direction: number) =>
   direction === 4 || direction === 5 || direction === 6;
const isLeft = (direction: number) =>
   direction === 0 || direction === 6 || direction === 7;
const isRight = (direction: number) =>
   direction === 2 || direction === 3 || direction === 4;

const buildIndexTree = () => {
   const incrementors = [-9, -8, -7, 1, 9, 8, 7, -1]; // cw starting upper-left
   return Array.from({ length: 8 }).map((_, direction) =>
      Array.from({ length: 64 }).map((_, index) => {
         if (isUp(direction) && index < 8) return null;
         if (isDown(direction) && index > 55) return null;
         if (isLeft(direction) && index % 8 === 0) return null;
         if (isRight(direction) && index % 8 === 7) return null;
         return index + incrementors[direction];
      })
   );
};
const indexTree = buildIndexTree(); // how to determine size in memory

const getFlipsInDirection = (
   gameState: GamePieceState[],
   target: 1 | -1,
   startIndex: number,
   direction: number
) => {
   const flipped: number[] = [];
   let nextIndex = indexTree[direction][startIndex];
   while (nextIndex !== null && gameState[nextIndex] !== null) {
      if (gameState[nextIndex] === target) return flipped;
      flipped.push(nextIndex);
      nextIndex = indexTree[direction][nextIndex];
   }

   // hit empty square or end of board
   // without finding a piece by the same player
   return [];
};

const directions = Array.from({ length: 8 }, (_, i) => i);
export const getStateFlips = (
   gameState: GamePieceState[],
   player: 1 | -1,
   moveIndex: number
) => {
   const flipsByDirection = directions.map((direction) =>
      getFlipsInDirection(gameState, player, moveIndex, direction)
   );

   return flipsByDirection.flat();
};

export const _forTesting = {
   isUp,
   isDown,
   isLeft,
   isRight,
   buildIndexTree,
   indexTree,
   getFlipsInDirection,
};
