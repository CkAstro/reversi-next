import { upgradeGame } from '../upgradeGame';
import {
   getGame,
   upgradeActiveGame,
   upgradePendingGame,
} from '@/lib/game/gameCache';

jest.mock('@/lib/game/gameCache', () => ({
   getGame: jest.fn(),
   upgradePendingGame: jest.fn(),
   upgradeActiveGame: jest.fn(),
}));

describe('upgradeGame', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('returns early if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);
      upgradeGame('mockId', 'pending');

      expect(getGame).toHaveBeenCalledWith('mockId');
      expect(upgradePendingGame).not.toHaveBeenCalled();
      expect(upgradeActiveGame).not.toHaveBeenCalled();
   });

   test('upgrades pending game if status is pending', () => {
      (getGame as jest.Mock).mockReturnValue({});
      upgradeGame('mockId', 'pending');

      expect(getGame).toHaveBeenCalledWith('mockId');
      expect(upgradePendingGame).toHaveBeenCalledWith('mockId');
      expect(upgradeActiveGame).not.toHaveBeenCalled();
   });

   test('upgrades active game if status is active', () => {
      (getGame as jest.Mock).mockReturnValue({});
      upgradeGame('mockId', 'active');

      expect(getGame).toHaveBeenCalledWith('mockId');
      expect(upgradePendingGame).not.toHaveBeenCalled();
      expect(upgradeActiveGame).toHaveBeenCalledWith('mockId');
   });
});
