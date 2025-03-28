/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { leave } from '../leave';
import { getGame } from '@/lib/game/cacheInterface';
import type { Client } from '@/lib/client/Client';

jest.mock('@/lib/game/cacheInterface', () => ({
   getGame: jest.fn(),
}));

describe('leave', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('callback with error if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);
      const callback = jest.fn();

      leave('badGameId', 'mockClient', callback);
      expect(callback).toHaveBeenCalledWith('GAME_NOT_FOUND', null, null, null);
   });

   test('removes player from game', () => {
      const mockPlayerId = 'mockClient';
      const mockRole = 1;

      const mockGame = {
         removePlayer: jest.fn(() => mockRole),
         getOpponentById: jest.fn(),
         getObservers: jest.fn(),
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      leave('goodGameId', mockPlayerId, callback);
      expect(mockGame.removePlayer).toHaveBeenCalledWith(mockPlayerId);
   });

   test('callback reports role, opponent, observers', () => {
      const mockPlayerId = 'mockClient';
      const mockRole = 1;
      const mockOpponent = { playerId: 'player1' } as Client;
      const mockObservers = new Map<string, Client>();

      const mockGame = {
         removePlayer: jest.fn(() => mockRole),
         getOpponentById: jest.fn(() => mockOpponent),
         getObservers: jest.fn(() => mockObservers),
      };

      (getGame as jest.Mock).mockReturnValue(mockGame);
      const callback = jest.fn();

      leave('goodGameId', mockPlayerId, callback);
      expect(mockGame.removePlayer).toHaveBeenCalledWith(mockPlayerId);
      expect(mockGame.getOpponentById).toHaveBeenCalledWith(mockPlayerId);
      expect(mockGame.getObservers).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
         null,
         mockRole,
         mockOpponent,
         mockObservers
      );
   });
});
