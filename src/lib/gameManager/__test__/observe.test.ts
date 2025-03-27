/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { observe } from '../observe';
import { getGame } from '@/lib/game/cacheInterface';
import type { Client } from '@/lib/client/Client';

jest.mock('@/lib/game/cacheInterface', () => ({
   getGame: jest.fn(),
}));

describe('observe', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('callback with error if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);
      const mockClient = {} as Client;
      const callback = jest.fn();

      observe('badGameId', mockClient, callback);
      expect(callback).toHaveBeenCalledWith('GAME_NOT_FOUND', null, null, null);
   });

   test('player is added to game as observer, reported with callback', () => {
      const mockRole = 0;
      const mockClient = {
         playerId: 'mockPlayer',
         opponent: null,
      } as Client;
      const mockObservers = new Map<string, Client>();

      const mockGame = {
         addPlayer: jest.fn((client: Client) => {
            mockObservers.set(client.playerId, client);
            return mockRole;
         }),
         getObservers: jest.fn(() => mockObservers),
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      observe('goodGameId', mockClient, callback);
      expect(mockGame.addPlayer).toHaveBeenCalledWith(mockClient);
      expect(mockGame.getObservers).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
         null,
         mockRole,
         null,
         mockObservers
      );
   });
});
