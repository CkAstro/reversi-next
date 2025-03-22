import type { Client } from '@/lib/client/Client';
import { createGame } from '@/lib/game/Game';
import { create } from '../create';

jest.mock('@/lib/game/Game', () => ({
   createGame: jest.fn(),
}));

describe('create', () => {
   const client = { playerId: 'testPlayer' } as unknown as Client;

   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('game creates', () => {
      const mockGame = {
         createGame: jest.fn(),
         gameId: 'mockGame',
         getRoleById: jest.fn(),
      };

      (createGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();
      create(client, callback);

      expect(createGame).toHaveBeenCalledWith(client);
      expect(callback).toHaveBeenCalled();
   });

   test('role returns correctly', () => {
      const mockGame = {
         createGame: jest.fn(),
         gameId: 'mockGame',
         getRoleById: jest.fn(() => 1),
      };

      (createGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();
      create(client, callback);

      expect(callback).toHaveBeenCalledWith('mockGame', 1);
   });
});
