import { getUniqueId } from '../getUniqueId';
jest.mock('../getUniqueId');

describe('getUniqueId', () => {
   test('id generates properly', () => {
      const id = getUniqueId();
      const segments = id.split('-');
      const expectedLengths = [8, 4, 4, 4, 12];
      expect(segments.length).toBe(5);
      segments.forEach((segment, index) => {
         expect(segment.length).toBe(expectedLengths[index]);
      });
   });

   test('successive calls return unique ids', () => {
      const id1 = getUniqueId();
      const id2 = getUniqueId();
      expect(id1).not.toBe(id2);
   });
});
