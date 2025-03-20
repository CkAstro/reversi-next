import { getRoleByPlayerId } from '../getRoleByPlayerId';
import { getGame } from '@/lib/game/gameCache';

jest.mock('@/lib/game/gameCache', () => ({
   getGame: jest.fn(),
}));

describe('getRoleByPlayerId', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('invalid gameId returns null', () => {
      (getGame as jest.Mock).mockReturnValue(null);

      expect(getRoleByPlayerId('testGame', 'testPlayer')).toBe(null);
   });
});
