/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { getOpponentByRole } from '../getOpponentByRole';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';

const createMockGame = () =>
   ({
      _playerA: null,
      _playerB: null,
   } as unknown as Game);

describe('Game - getOpponentByRole', () => {
   test('role of 1 returns playerB', () => {
      const game = createMockGame();
      const mockClient1 = {} as Client;
      const mockClient2 = {} as Client;
      game._playerA = mockClient1;
      game._playerB = mockClient2;

      expect(getOpponentByRole.call(game, 1)).toBe(mockClient2);
   });

   test('role of -1 returns playerA', () => {
      const game = createMockGame();
      const mockClient1 = {} as Client;
      const mockClient2 = {} as Client;
      game._playerA = mockClient1;
      game._playerB = mockClient2;

      expect(getOpponentByRole.call(game, -1)).toBe(mockClient1);
   });

   test('role of 0 returns null', () => {
      const game = createMockGame();
      const mockClient1 = {} as Client;
      const mockClient2 = {} as Client;
      game._playerA = mockClient1;
      game._playerB = mockClient2;

      expect(getOpponentByRole.call(game, 0)).toBe(null);
   });

   test('role of null returns null', () => {
      const game = createMockGame();
      const mockClient1 = {} as Client;
      const mockClient2 = {} as Client;
      game._playerA = mockClient1;
      game._playerB = mockClient2;

      expect(getOpponentByRole.call(game, null)).toBe(null);
   });

   test('no opponent returns null', () => {
      const game = createMockGame();
      const mockClient1 = {} as Client;
      game._playerA = mockClient1;

      expect(getOpponentByRole.call(game, -1)).toBe(mockClient1);
      expect(getOpponentByRole.call(game, 1)).toBe(null);
   });
});
