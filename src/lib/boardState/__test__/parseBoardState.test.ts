import { parseBoardState } from '../parseBoardState';

describe('parseBoardState', () => {
   test('sanity check', () => {
      const serializedState = ',,,';
      expect(parseBoardState(serializedState)).toStrictEqual([
         null,
         null,
         null,
         null,
      ]);
   });

   test('empty board parses', () => {
      const serializedState = ','.repeat(63);
      const expected = Array.from({ length: 64 }, () => null);
      expect(parseBoardState(serializedState)).toStrictEqual(expected);
   });

   test('full board parses', () => {
      const serializedState = '1,'.repeat(63) + '1';
      const expected = Array.from({ length: 64 }, () => 1);
      expect(parseBoardState(serializedState)).toStrictEqual(expected);
   });

   test('partial board parses', () => {
      const serializedState = ',,,1,-1,1' + ','.repeat(58);
      const expected = Array.from({ length: 64 }, (_, i) => {
         if ([3, 4, 5].includes(i)) return i % 2 === 0 ? -1 : 1;
         return null;
      });
      expect(parseBoardState(serializedState)).toStrictEqual(expected);
   });
});
