import { getOpponent } from '../getOpponent';
import { getGame } from '../gameCache';

jest.mock('../gameCache', () => ({
   getGame: jest.fn(),
}));

describe('getOpponent', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('invalid gameId returns null opponent', () => {
      (getGame as jest.Mock).mockReturnValue(null);

      expect(getOpponent('testGame', 'testPlayer')).toBe(null);
   });

   test('invalid player returns null opponent', () => {
      (getGame as jest.Mock).mockReturnValue({
         playerA: { playerId: 'playerA' },
         playerB: { playerId: 'playerB' },
      });

      expect(getOpponent('testGame', 'testPlayer')).toBe(null);
   });

   test('full game returns expected opponent', () => {
      (getGame as jest.Mock).mockReturnValue({
         playerA: { playerId: 'playerA' },
         playerB: { playerId: 'playerB' },
      });

      expect(getOpponent('testGame', 'playerA')).toBe('playerB');
   });

   test('partial game returns null opponent', () => {
      (getGame as jest.Mock).mockReturnValue({
         playerA: { playerId: 'playerA' },
         playerB: null,
      });

      expect(getOpponent('testGame', 'playerA')).toBe(null);
   });
});
