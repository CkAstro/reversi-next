/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { join } from '../join';
import { getGame } from '@/lib/game/gameCache';
import type { Client } from '@/lib/client/Client';

jest.mock('@/lib/game/gameCache', () => ({
   getGame: jest.fn(),
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
      expect(callback).toHaveBeenCalledWith('GAME_NOT_FOUND', null, null, null);
   });

   test('adds player to game', () => {
      const mockRole = 1;
      const mockOpponent = { playerId: 'player1' } as Client;
      const mockClient = { opponent: mockOpponent } as Client;
      const mockObservers = new Map<string, Client>();

      const mockGame = {
         addPlayer: jest.fn(() => mockRole),
         getObservers: jest.fn(() => mockObservers),
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
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      join('goodGameId', mockClient, callback);
      expect(mockGame.addPlayer).toHaveBeenCalledWith(mockClient);
      expect(mockGame.getObservers).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
         null,
         mockRole,
         mockOpponent,
         mockObservers
      );
   });
});
