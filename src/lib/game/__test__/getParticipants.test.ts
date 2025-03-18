import { getParticipants } from '../getParticipants';
import { getGame } from '../gameCache';

jest.mock('../gameCache', () => ({
   getGame: jest.fn(),
}));

describe('getParticipants', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('invalid gameId returns empty list', () => {
      (getGame as jest.Mock).mockReturnValue(null);

      expect(getParticipants('testGame')).toStrictEqual([]);
   });

   test('empty game returns empty array', () => {
      (getGame as jest.Mock).mockReturnValue({
         playerA: null,
         playerB: null,
         observers: [],
      });

      expect(getParticipants('testGame')).toStrictEqual([]);
   });

   test('full game returns expected participants', () => {
      (getGame as jest.Mock).mockReturnValue({
         playerA: { playerId: 'playerA' },
         playerB: { playerId: 'playerB' },
         observers: [{ playerId: 'observer1' }, { playerId: 'observer2' }],
      });

      expect(getParticipants('testGame')).toStrictEqual([
         'playerA',
         'playerB',
         'observer1',
         'observer2',
      ]);
   });
});
