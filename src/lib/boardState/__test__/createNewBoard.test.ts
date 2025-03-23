import { createNewBoard } from '../createNewBoard';

describe('createNewBoard', () => {
   test('board is correct size', () => {
      const boardState = createNewBoard();
      expect(boardState.length).toBe(64);
   });

   test('board is empty', () => {
      const boardState = createNewBoard();
      const nullCount = boardState.filter((square) => square === null).length;
      expect(nullCount).toBe(64);
   });

   test('board is immutable copy', () => {
      const boardState1 = createNewBoard();
      const boardState2 = createNewBoard();
      expect(boardState1).toStrictEqual(boardState2);

      boardState1[2] = 1;
      expect(boardState1).not.toStrictEqual(boardState2);
   });
});
