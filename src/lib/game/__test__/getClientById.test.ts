/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { getClientById } from '../getClientById';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';

describe('Game - assignToGame', () => {
   test('returns playerA if playerId matches', () => {
      const mockClient = { playerId: 'mockPlayer' } as Client;
      const mockGame = { _playerA: mockClient } as Game;

      expect(getClientById.call(mockGame, 'mockPlayer')).toBe(mockClient);
   });

   test('returns playerB if playerId matches', () => {
      const mockClient = { playerId: 'mockPlayer' } as Client;
      const mockGame = {
         _playerA: { playerId: 'anotherPlayer' } as Client,
         _playerB: mockClient,
      } as Game;

      expect(getClientById.call(mockGame, 'mockPlayer')).toBe(mockClient);
   });

   test('returns observer if playerId matches', () => {
      const mockClient = { playerId: 'mockPlayer' } as Client;
      const mockGame = {
         _playerA: { playerId: 'playerA' } as Client,
         _playerB: { playerId: 'playerB' } as Client,
         _observers: new Map<string, Client>(),
      } as Game;
      mockGame._observers.set(mockClient.playerId, mockClient);

      expect(getClientById.call(mockGame, 'mockPlayer')).toBe(mockClient);
      expect(
         getClientById.call(
            { _observers: mockGame._observers } as Game,
            'mockPlayer'
         )
      ).toBe(mockClient);
   });

   test('returns null if playerId does not match', () => {
      const mockClient = { playerId: 'mockPlayer' } as Client;
      const mockGame = {
         _playerA: { playerId: 'playerA' } as Client,
         _playerB: { playerId: 'playerB' } as Client,
         _observers: new Map<string, Client>(),
      } as Game;
      mockGame._observers.set(mockClient.playerId, mockClient);

      expect(getClientById.call(mockGame, 'wrongId')).toBe(null);
   });
});
