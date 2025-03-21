import { OrderedCache } from '../OrderedCache';

describe('OrderedCache', () => {
   test('cache inserts at start', () => {
      const cache = new OrderedCache<string, string>();
      cache.insert('first', '1');
      cache.insert('second', '2');
      cache.insert('third', '3');

      expect(cache.getKeys()).toStrictEqual(['third', 'second', 'first']);
      expect(cache.getValue('first')).toBe('1');
      expect(cache.getValue('second')).toBe('2');
      expect(cache.getValue('third')).toBe('3');
      expect(cache.getRange(3, 0)).toStrictEqual(['3', '2', '1']);
   });

   test('getRange retrieves correct count', () => {
      const cache = new OrderedCache<number, number>();
      for (let i = 0; i < 10; i++) {
         cache.insert(i, i);
      }

      expect(cache.getRange(3, 0)).toStrictEqual([9, 8, 7]);
   });

   test('getRange retrieves correct page', () => {
      const cache = new OrderedCache<number, number>();
      for (let i = 0; i < 10; i++) {
         cache.insert(i, i);
      }

      expect(cache.getRange(3, 2)).toStrictEqual([3, 2, 1]);
   });

   test('getRange retrieves partial page if not enough entries', () => {
      const cache = new OrderedCache<number, number>();
      for (let i = 0; i < 10; i++) {
         cache.insert(i, i);
      }

      expect(cache.getRange(3, 3)).toStrictEqual([0]);
   });

   test('getRange retrieves nothing for negative page', () => {
      const cache = new OrderedCache<number, number>();
      for (let i = 0; i < 10; i++) {
         cache.insert(i, i);
      }

      expect(cache.getRange(3, -1)).toStrictEqual([]);
   });

   test('getRange retrieves nothing for empty cache', () => {
      const cache = new OrderedCache<number, number>();

      expect(cache.getRange(3, 0)).toStrictEqual([]);
   });
});
