import { validateMove, _forTesting, isValidateMove } from '../validateMove';
import type { Reversi } from '@/types/reversi';

const flipState = (state: (1 | -1 | null)[], index: number): 1 | -1 | null => {
   const flippedValue =
      state[index] === null ? null : (-state[index] as 1 | -1);
   return flippedValue;
};

describe('updateGameState', () => {
   const { updateGameState } = _forTesting;

   /* looking at top-left corner of board
    *   _____________________
    *   | 1 | 1 | 1 |   |   |
    *   | 1 |-1 |-1 |   |   |
    *   | 1 |-1 |   |   |   |
    *   |-1_|___|___|___|___|
    */
   const testState = Array.from({ length: 64 }).map((_, i) => {
      if (i < 3 || i === 8 || i === 16) return 1;
      if (i === 9 || i === 10 || i === 17 || i === 24) return -1;
      return null;
   });

   test('moveIndex entry is updated', () => {
      const expected = [...testState];
      expected[18] = 1;

      expect(updateGameState(testState, [], 18, 1)).toStrictEqual(expected);
   });

   test('flip states are updated', () => {
      const expected = [...testState];
      expected[9] = flipState(expected, 9);
      expected[17] = flipState(expected, 17);
      expected[25] = 1;

      expect(updateGameState(testState, [9, 17], 25, 1)).toStrictEqual(
         expected
      );
   });
});

describe('validateMove', () => {
   /* looking at top-left corner of board
    *      ___________________
    *   0 | 1 | 1 | 1 |   |   |
    *   8 | 1 |-1 |-1 |   |   |
    *  16 | 1 |-1 |   |   |   |
    *  24 |-1 |   |   |   |   |
    *  32 | 1 |   |   |   |   |
    *  40 |___|___|___|___|___|
    */
   const testState = Array.from({ length: 64 }).map((_, i) => {
      if (i < 3 || i === 8 || i === 16 || i === 32) return 1;
      if (i === 9 || i === 10 || i === 17 || i === 24) return -1;
      return null;
   });

   test('states flip with valid move', () => {
      const expected = [...testState];
      expected[9] = flipState(expected, 9);
      expected[17] = flipState(expected, 17);
      expected[25] = 1;

      expect(validateMove(testState, 25, 1, 10)).toStrictEqual(expected);
   });

   test('invalid move returns null', () => {
      expect(validateMove(testState, 3, 1, 10)).toBe(null);
   });

   test('multi-direction flip functions', () => {
      const expected = [...testState];
      expected[9] = flipState(expected, 9);
      expected[10] = flipState(expected, 10);
      expected[17] = flipState(expected, 17);
      expected[18] = 1;

      expect(validateMove(testState, 18, 1, 10)).toStrictEqual(expected);
   });
});

describe('validateMove - firstFourRounds', () => {
   const nullState = Array.from({ length: 64 }, () => null) as (
      | 1
      | -1
      | null
   )[];
   const innerFour = [27, 28, 35, 36];

   test('only inner four are allowed', () => {
      const { handleFirstFourRounds } = _forTesting;
      for (let i = 0; i < 64; i++) {
         // avoid conditional testing
         const firstRoundState = handleFirstFourRounds(nullState, i, 1);
         const isValid = firstRoundState !== null;
         const expectedIsValid = innerFour.includes(i);

         expect(isValid).toBe(expectedIsValid);
      }
   });

   test('flip not required', () => {
      let nextState = [...nullState] as typeof nullState;
      let player = 1 as 1 | -1;
      for (let i = 0; i < 4; i++) {
         nextState = validateMove(nextState, innerFour[i], player, i)!;
         player = -player as 1 | -1;
         expect(nextState).not.toBe(null);
      }

      // fifth move should require a flip
      expect(validateMove(nextState, 26, player, 4)); // will not produce a flip
   });
});

describe('isValidMove', () => {
   const boardState: Reversi['BoardState'] = Array.from(
      { length: 64 },
      () => null
   );
   beforeEach(() => {
      for (let i = 0; i < 64; i++) boardState[i] = null;
   });

   test('returns true if a flip is present', () => {
      boardState[0] = 1;
      boardState[1] = -1;
      expect(isValidateMove(boardState, 2, 1)).toBe(true);
   });

   test('returns false if no flip is present', () => {
      boardState[0] = 1;
      expect(isValidateMove(boardState, 1, -1)).toBe(false);
   });

   test('returns false on blank board', () => {
      expect(isValidateMove(boardState, 1, 1)).toBe(false);
   });

   test('returns false on full board', () => {
      boardState.forEach((_, i) => (boardState[i] = 1));
      expect(isValidateMove(boardState, 1, -1)).toBe(false);
   });

   test('returns true on nearly-full board', () => {
      boardState.forEach(
         (_, i) => (boardState[i] = i === 0 ? null : i === 63 ? -1 : 1)
      );
      expect(isValidateMove(boardState, 0, 1)).toBe(false);
      expect(isValidateMove(boardState, 0, -1)).toBe(true);
   });
});
