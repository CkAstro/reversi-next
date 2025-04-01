import { requestMove } from '../requestMove';
import { getGame } from '@/lib/game/cacheInterface';
import { upgradeGame } from '@/lib/gameManager/upgradeGame';

jest.mock('@/lib/game/cacheInterface', () => ({
   getGame: jest.fn(),
}));

jest.mock('@/lib/gameManager/upgradeGame', () => ({
   upgradeGame: jest.fn(),
}));

describe('observe', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('callback with error if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);
      const mockRole = 1;
      const mockMove = 1;
      const callback = jest.fn();

      requestMove('badGameId', mockRole, mockMove, callback);
      expect(callback).toHaveBeenCalledWith('GAME_NOT_FOUND', [], 1, null);
   });

   test('callback with error if move is invalid', () => {
      const mockGame = {
         placeGamePiece: jest.fn(() => false), // force invalid move
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const mockRole = 1;
      const mockMove = 1;
      const callback = jest.fn();

      requestMove('goodGameId', mockRole, mockMove, callback);
      expect(mockGame.placeGamePiece).toHaveBeenCalledWith(mockRole, mockMove);
      expect(callback).toHaveBeenCalledWith('INVALID_MOVE', [], mockRole, null);
   });

   test('callback returns boardState, turn, and client list', () => {
      const mockBoardState = [null, 1, -1];
      const mockGame = {
         placeGamePiece: jest.fn(() => true), // allow valid move
         getBoardState: jest.fn(() => mockBoardState),
         isGameOver: jest.fn(() => false),
         turn: -1,
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const mockRole = 1;
      const mockMove = 1;
      const callback = jest.fn();

      requestMove('goodGameId', mockRole, mockMove, callback);
      expect(mockGame.getBoardState).toHaveBeenCalled();
      expect(mockGame.isGameOver).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, mockBoardState, -1, null);
   });

   test('callback returns winner if no moves are left', () => {
      const mockBoardState = [null, 1, -1];
      const mockGame = {
         placeGamePiece: jest.fn(() => true), // allow valid move
         getBoardState: jest.fn(() => mockBoardState),
         isGameOver: jest.fn(() => true),
         getScore: jest.fn(),
         turn: -1,
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      mockGame.getScore
         .mockReturnValueOnce([1, 2]) // -1 wins on first call
         .mockReturnValueOnce([2, 1]) // 1 wins on second call
         .mockReturnValueOnce([2, 2]); // tie on third call
      const mockRole = 1;
      const mockMove = 1;
      const callback = jest.fn();

      requestMove('goodGameId', mockRole, mockMove, callback);
      expect(upgradeGame).toHaveBeenCalledWith('goodGameId', 'active');
      expect(mockGame.isGameOver).toHaveBeenCalled();
      expect(mockGame.getScore).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, mockBoardState, -1, -1);
      expect(callback).not.toHaveBeenCalledWith(null, mockBoardState, -1, 1);

      requestMove('goodGameId', mockRole, mockMove, callback);
      expect(callback).toHaveBeenCalledWith(null, mockBoardState, -1, 1);

      requestMove('goodGameId', mockRole, mockMove, callback);
      expect(callback).toHaveBeenCalledWith(null, mockBoardState, -1, 0);
   });
});
