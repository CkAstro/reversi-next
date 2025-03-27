import { getBoardState } from '../getBoardState';
import { getGame } from '@/lib/game/cacheInterface';

jest.mock('@/lib/game/cacheInterface', () => ({
   getGame: jest.fn(),
}));

describe('getBoardState', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('callback with error if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);
      const callback = jest.fn();

      getBoardState('badGameId', callback);
      expect(callback).toHaveBeenCalledWith('GAME_NOT_FOUND', [], 1);
   });

   test('callback with boardState and turn if game exists', () => {
      const boardState = [null, 1, -1];
      const mockGame = {
         getBoardState: jest.fn(() => boardState),
         turn: -1,
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      getBoardState('goodGameId', callback);
      expect(mockGame.getBoardState).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, boardState, -1);
   });
});
