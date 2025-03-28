/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { join } from '../join';
import { getGame } from '@/lib/game/cacheInterface';
import type { Client } from '@/lib/client/Client';
import { upgradeGame } from '@/lib/gameManager/upgradeGame';

jest.mock('@/lib/game/cacheInterface', () => ({
   getGame: jest.fn(),
}));

jest.mock('@/lib/gameManager/upgradeGame', () => ({
   upgradeGame: jest.fn(),
}));

describe('join', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('callback with error if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);
      const mockClient = {} as Client;
      const callback = jest.fn();

      join('badGameId', mockClient, callback);
      expect(callback).toHaveBeenCalledWith(
         'GAME_NOT_FOUND',
         null,
         null,
         null,
         false
      );
   });

   test('adds player to game', () => {
      const mockRole = 1;
      const mockOpponent = { playerId: 'player1' } as Client;
      const mockClient = { opponent: mockOpponent } as Client;
      const mockObservers = new Map<string, Client>();

      const mockGame = {
         addPlayer: jest.fn(() => mockRole),
         getObservers: jest.fn(() => mockObservers),
         status: 'pending',
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      join('goodGameId', mockClient, callback);
      expect(mockGame.addPlayer).toHaveBeenCalledWith(mockClient);
   });

   test('callback reports correctly', () => {
      const mockRole = 1;
      const mockOpponent = { playerId: 'player1' } as Client;
      const mockClient = { opponent: mockOpponent } as Client;
      const mockObservers = new Map<string, Client>();

      const mockGame = {
         addPlayer: jest.fn(() => mockRole),
         getObservers: jest.fn(() => mockObservers),
         status: 'active', // we're not testing this
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      join('goodGameId', mockClient, callback);
      expect(mockGame.addPlayer).toHaveBeenCalledWith(mockClient);
      expect(mockGame.getObservers).toHaveBeenCalled();
      expect(upgradeGame).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
         null,
         mockRole,
         mockOpponent,
         mockObservers,
         false
      );
   });

   test('game reports upgrade if client joins and opponent is present', () => {
      const mockRole = 1;
      const mockOpponent = { playerId: 'player1' } as Client;
      const mockClient = { opponent: mockOpponent } as Client;
      const mockObservers = new Map<string, Client>();

      const mockGame = {
         gameId: 'goodGameId',
         addPlayer: jest.fn(() => mockRole),
         getObservers: jest.fn(() => mockObservers),
         status: 'pending',
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      join('goodGameId', mockClient, callback);
      expect(upgradeGame).toHaveBeenCalledWith('goodGameId', 'pending');
      expect(callback).toHaveBeenCalledWith(
         null,
         mockRole,
         mockOpponent,
         mockObservers,
         true
      );
   });
});
