import type { ReversiPlayer } from '@/types/reversi';
import { serializeBoardState } from '../serializeBoardState';

describe('serializeBoardState', () => {
   test('sanity check', () => {
      const boardState = [null, null, null, null];
      expect(serializeBoardState(boardState)).toBe(',,,');
      expect(serializeBoardState(boardState)).not.toBe(',,');
      expect(serializeBoardState(boardState)).not.toBe(',,,,');
   });

   test('empty board serializes', () => {
      const boardState = Array.from({ length: 64 }, () => null);
      const expected = ','.repeat(63);
      expect(serializeBoardState(boardState)).toBe(expected);
   });

   test('full board serializes', () => {
      const boardState: ReversiPlayer[] = Array.from({ length: 64 }, () => 1);
      const expected = '1,'.repeat(63) + '1';
      expect(serializeBoardState(boardState)).toBe(expected);
   });

   test('partial board serializes', () => {
      const boardState = Array.from({ length: 64 }, (_, i) => {
         if ([3, 4, 5].includes(i)) return i % 2 === 0 ? -1 : 1;
         return null;
      });
      const expected = ',,,1,-1,1' + ','.repeat(58);
      expect(serializeBoardState(boardState)).toBe(expected);
   });
});
