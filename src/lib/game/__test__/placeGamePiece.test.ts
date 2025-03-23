import { placeGamePiece } from '../placeGamePiece';
import type { Game } from '@/lib/game/Game';
import { validateMove } from '@/lib/boardState/validateMove';

jest.mock('@/lib/boardState/validateMove', () => ({
   validateMove: jest.fn(),
}));

const createMockGame = () =>
   ({
      _currentTurn: 1,
      _boardState: [null, null, -1],
      _currentRound: 1,
      _moveHistory: [{ player: -1, move: 2 }],
   } as unknown as Game);

describe('Game - assignToGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("returns false if it is not player's turn", () => {
      const mockGame = createMockGame();
      const invalidRole = -1;
      // (validateMove as jest.Mock).mockRejectedValue()

      const success = placeGamePiece.call(mockGame, invalidRole, 1);
      expect(success).toBe(false);
      expect(validateMove).not.toHaveBeenCalled();
   });

   test('invalid move returns false and does not update boardState', () => {
      const mockGame = createMockGame();
      (validateMove as jest.Mock).mockReturnValue(null); // invalid move

      const success = placeGamePiece.call(mockGame, 1, 1);
      expect(success).toBe(false);
      expect(validateMove).toHaveBeenCalledWith(mockGame._boardState, 1, 1, 1);
   });

   test('valid move returns true and updates game properties', () => {
      const mockGame = createMockGame();
      (validateMove as jest.Mock).mockReturnValue([null, 1, -1]); // valid move

      const success = placeGamePiece.call(mockGame, 1, 1);
      expect(success).toBe(true);
      expect(mockGame).toStrictEqual({
         _currentTurn: -1, // flip turn
         _boardState: [null, 1, -1], // updated move
         _currentRound: 2, // increment round
         _moveHistory: [
            { player: -1, move: 2 },
            { player: 1, move: 1 }, // newest move
         ],
      });
   });
});
