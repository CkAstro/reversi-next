import { removePlayer } from '../removePlayer';
import type { Game } from '@/lib/game/Game';

const createMockGame = () =>
   ({
      getClientById: jest.fn(),
      _unassignFromGame: jest.fn(),
   } as unknown as Game);

describe('Game - assignToGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test('calls for unassign', () => {
      const mockGame = createMockGame();
      const mockClient = { playerId: 'mockClient' };
      (mockGame.getClientById as jest.Mock).mockReturnValue(mockClient);
      (mockGame._unassignFromGame as jest.Mock).mockReturnValue(1);

      const role = removePlayer.call(mockGame, 'mockPlayer');
      expect(role).not.toBe(null);
      expect(mockGame.getClientById).toHaveBeenCalledWith('mockPlayer');
      expect(mockGame._unassignFromGame).toHaveBeenCalledWith(mockClient);
   });

   test('does nothing if player does not exist', () => {
      const mockGame = createMockGame();
      (mockGame.getClientById as jest.Mock).mockReturnValue(null);

      const role = removePlayer.call(mockGame, 'mockPlayer');
      expect(role).toBe(null);
      expect(mockGame.getClientById).toHaveBeenCalledWith('mockPlayer');
      expect(mockGame._unassignFromGame).not.toHaveBeenCalled();
   });
});
