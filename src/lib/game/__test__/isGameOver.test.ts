/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { isGameOver } from '../isGameOver';
import { isValidateMove } from '@/lib/boardState/validateMove';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';

jest.mock('@/lib/boardState/validateMove', () => ({
   isValidateMove: jest.fn(),
}));

describe('Game - isGameOver', () => {
   const mockBoardState: Reversi['BoardState'] = Array.from(
      { length: 64 },
      () => null
   );
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('exits early with false if round < 4', () => {
      const mockGame = { _currentRound: 1 } as Game;
      expect(isGameOver.call(mockGame)).toBe(false);
      expect(isValidateMove).not.toHaveBeenCalled();
   });

   test('returns false if valid move is found', () => {
      (isValidateMove as jest.Mock)
         .mockReturnValueOnce(false)
         .mockReturnValueOnce(false)
         .mockReturnValueOnce(true)
         .mockReturnValueOnce(false);

      const mockGame = {
         _currentRound: 5,
         _boardState: mockBoardState,
         _currentTurn: 1,
      } as Game;
      expect(isGameOver.call(mockGame)).toBe(false);
      expect(isValidateMove).toHaveBeenCalledWith(mockBoardState, 0, 1);
      expect(isValidateMove).toHaveBeenCalledTimes(3);
   });

   test('returns true if no valid move is found', () => {
      (isValidateMove as jest.Mock).mockReturnValue(false);

      const mockGame = {
         _currentRound: 5,
         _boardState: mockBoardState,
         _currentTurn: 1,
      } as Game;
      expect(isGameOver.call(mockGame)).toBe(true);
      expect(isValidateMove).toHaveBeenCalledTimes(64);
   });
});
