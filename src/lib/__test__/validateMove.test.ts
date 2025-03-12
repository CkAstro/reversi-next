import { validateMove, _forTesting } from '../validateMove';

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

   test('moveIndex is updated', () => {
      const expected = [...testState];
      expected[18] = 1; //

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

   beforeEach(() => {
      _forTesting.setTurn(1);
      _forTesting.setRound(10);
   });

   test('states flip with valid move', () => {
      const expected = [...testState];
      expected[9] = flipState(expected, 9);
      expected[17] = flipState(expected, 17);
      expected[25] = 1;

      expect(validateMove(testState, 1, 25)).toStrictEqual(expected);
   });

   test('invalid move returns null', () => {
      expect(validateMove(testState, 1, 3)).toBe(null);
   });

   test('invalid turn returns null', () => {
      const testArgs = [testState, -1, 40] as const;
      expect(validateMove(...testArgs)).toBe(null);

      // set turn and prove non-null
      const expected = [...testState];
      expected[32] = flipState(expected, 32);
      expected[40] = -1;

      _forTesting.setTurn(-1);
      expect(validateMove(...testArgs)).toStrictEqual(expected);
   });

   test('valid move updates turn', () => {
      expect(_forTesting.getTurn()).toBe(1);
      validateMove(testState, 1, 25);
      expect(_forTesting.getTurn()).toBe(-1);
   });

   test('invalid turn does not update turn', () => {
      expect(_forTesting.getTurn()).toBe(1);
      expect(validateMove(testState, -1, 40)).toBe(null);
      expect(_forTesting.getTurn()).toBe(1);
   });

   test('turn flips with valid move', () => {
      const firstExpected = [...testState];
      firstExpected[9] = flipState(firstExpected, 9);
      firstExpected[17] = flipState(firstExpected, 17);
      firstExpected[25] = 1;

      const secondExpected = [...firstExpected];
      secondExpected[10] = flipState(secondExpected, 10);
      secondExpected[18] = 1;

      // first verify both moves are valid
      const nextState = validateMove(testState, 1, 25);
      expect(nextState).not.toStrictEqual(testState);
      expect(nextState).toStrictEqual(firstExpected);

      _forTesting.setTurn(1);
      expect(nextState).not.toBe(null);
      expect(validateMove(nextState!, 1, 18)).toStrictEqual(secondExpected);

      // then reset and re-run both moves
      _forTesting.setTurn(1);
      expect(validateMove(testState, 1, 25)).toStrictEqual(firstExpected);
      expect(validateMove(testState, 1, 18)).toBe(null);
   });

   test('multi-direction flip functions', () => {
      const expected = [...testState];
      expected[9] = flipState(expected, 9);
      expected[10] = flipState(expected, 10);
      expected[17] = flipState(expected, 17);
      expected[18] = 1;

      expect(validateMove(testState, 1, 18)).toStrictEqual(expected);
   });
});

describe('validateMove - firstFourRounds', () => {
   const nullState = Array.from({ length: 64 }, () => null) as (
      | 1
      | -1
      | null
   )[];
   const innerFour = [27, 28, 35, 36];

   beforeEach(() => {
      _forTesting.setRound(0);
      _forTesting.setTurn(1);
   });

   test('only inner four are allowed', () => {
      const { handleFirstFourRounds } = _forTesting;
      for (let i = 0; i < 64; i++) {
         _forTesting.setTurn(1);
         _forTesting.setRound(0);

         // avoid conditional testing
         const firstRoundState = handleFirstFourRounds(nullState, i, 1);
         const isValid = firstRoundState !== null;
         const expectedIsValid = innerFour.includes(i);

         expect(isValid).toBe(expectedIsValid);
      }
   });

   test('flip not required', () => {
      let nextState = [...nullState] as typeof nullState;
      let player = _forTesting.getTurn();
      for (let i = 0; i < 4; i++) {
         nextState = validateMove(nextState, player, innerFour[i])!;
         player = -player as 1 | -1;
         expect(nextState).not.toBe(null);
      }

      // fifth move should require a flip
      expect(validateMove(nextState, player, 26)); // will not produce a flip
   });
});
