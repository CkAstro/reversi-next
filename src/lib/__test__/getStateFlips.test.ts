import { getStateFlips, _forTesting } from '../getStateFlips';

describe('getStateFlips - directions', () => {
   const { isUp, isDown, isLeft, isRight } = _forTesting;

   const directions = Array.from({ length: 8 }, (_, i) => i);
   const expected = [
      ['up', 'left'],
      ['up'],
      ['up', 'right'],
      ['right'],
      ['down', 'right'],
      ['down'],
      ['down', 'left'],
      ['left'],
   ];

   test('isUp reports correct directions', () => {
      directions.forEach((direction, i) => {
         expect(isUp(direction)).toBe(expected[i].includes('up'));
      });
   });

   test('isDown reports correct directions', () => {
      directions.forEach((direction, i) => {
         expect(isDown(direction)).toBe(expected[i].includes('down'));
      });
   });

   test('isUp reports correct directions', () => {
      directions.forEach((direction, i) => {
         expect(isLeft(direction)).toBe(expected[i].includes('left'));
      });
   });

   test('isUp reports correct directions', () => {
      directions.forEach((direction, i) => {
         expect(isRight(direction)).toBe(expected[i].includes('right'));
      });
   });

   const { indexTree } = _forTesting;
   test('indexTree builds with correct dimensions', () => {
      expect(indexTree.length).toBe(8);
      indexTree.forEach((direction) => {
         expect(direction.length).toBe(64);
      });

      // check nulls, should be 3 for each edge zone, 5 for each corner
      expect(indexTree.flat().filter((ind) => ind === null).length).toBe(
         3 * 24 + 5 * 4
      );
   });
});

describe('getStateFlips - composite', () => {
   const { getFlipsInDirection } = _forTesting;

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

   test('edge returns empty list', () => {
      expect(getFlipsInDirection(testState, 1, 7, 4)).toStrictEqual([]);
      expect(getFlipsInDirection(testState, -1, 7, 4)).toStrictEqual([]);
   });

   test('same color neighbor returns empty list', () => {
      expect(getFlipsInDirection(testState, 1, 3, 7)).toStrictEqual([]); // r1c4 looking left
      expect(getFlipsInDirection(testState, -1, 11, 7)).toStrictEqual([]); // r2c4 looking left
   });

   test('no same color in direction returns empty list', () => {
      expect(getFlipsInDirection(testState, -1, 3, 7)).toStrictEqual([]); // r1c4 looking left
      expect(getFlipsInDirection(testState, 1, 25, 7)).toStrictEqual([]); // r4c2 looking left
   });

   test('same color in direction returns correct list', () => {
      expect(getFlipsInDirection(testState, 1, 18, 7)).toStrictEqual([17]); // r3c3 looking left
      expect(getFlipsInDirection(testState, 1, 18, 0)).toStrictEqual([9]); // r3c3 looking up-left
      expect(getFlipsInDirection(testState, 1, 18, 1)).toStrictEqual([10]); // r3c3 looking up
      expect(getFlipsInDirection(testState, 1, 25, 1)).toStrictEqual([17, 9]); // r4c2 looking up
   });

   test('multi-direction catches all directions', () => {
      expect(getStateFlips(testState, 1, 18)).toStrictEqual([9, 10, 17]); // r3c3
   });

   test('multi-direction ignores no same color', () => {
      expect(getStateFlips(testState, 1, 25)).toStrictEqual([17, 9]); // r4c2
   });
});
