import { requestMove } from '../requestMove';
import { getGame } from '@/lib/game/gameCache';
import type { Client } from '@/lib/client/Client';

jest.mock('@/lib/game/gameCache', () => ({
   getGame: jest.fn(),
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
      expect(callback).toHaveBeenCalledWith('GAME_NOT_FOUND', [], 1, []);
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
      expect(callback).toHaveBeenCalledWith('INVALID_MOVE', [], mockRole, []);
   });

   test('callback returns boardState, turn, and client list', () => {
      const mockBoardState = [null, 1, -1];
      const mockClientList: Client[] = [];
      const mockGame = {
         placeGamePiece: jest.fn(() => true), // allow valid move
         getBoardState: jest.fn(() => mockBoardState),
         getAllClients: jest.fn(() => mockClientList),
         turn: -1,
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const mockRole = 1;
      const mockMove = 1;
      const callback = jest.fn();

      requestMove('goodGameId', mockRole, mockMove, callback);
      expect(mockGame.getBoardState).toHaveBeenCalled();
      expect(mockGame.getAllClients).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
         null,
         mockBoardState,
         -1,
         mockClientList
      );
   });
});
