/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { getOpponentById } from '../getOpponentById';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const createMockGame = () =>
   ({
      _playerA: null,
      _playerB: null,
      _observers: new Map<Reversi['PlayerId'], Client>(),
   } as unknown as Game);

describe('Game - assignToGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test('playerA id returns playerB', () => {
      const game = createMockGame();
      const mockClient1 = { playerId: 'player1' } as Client;
      const mockClient2 = { playerId: 'player2' } as Client;
      game._playerA = mockClient1;
      game._playerB = mockClient2;

      expect(getOpponentById.call(game, 'player1')).toBe(mockClient2);
   });

   test('playerB id returns playerA', () => {
      const game = createMockGame();
      const mockClient1 = { playerId: 'player1' } as Client;
      const mockClient2 = { playerId: 'player2' } as Client;
      game._playerA = mockClient1;
      game._playerB = mockClient2;

      expect(getOpponentById.call(game, 'player2')).toBe(mockClient1);
   });

   test('observer id returns null', () => {
      const game = createMockGame();
      const mockClient1 = { playerId: 'player1' } as Client;
      game._observers.set('player1', mockClient1);

      expect(getOpponentById.call(game, 'player1')).toBe(null);
   });

   test('no opponent returns null', () => {
      const game = createMockGame();
      const mockClient1 = { playerId: 'player1' } as Client;
      game._playerA = mockClient1;

      expect(getOpponentById.call(game, 'player1')).toBe(null);
   });
});
