/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { getPlayers } from '../getPlayers';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';

describe('Game - assignToGame', () => {
   test('returns both players', () => {
      const playerA = { username: 'playerA' } as Client;
      const playerB = { username: 'playerB' } as Client;
      const mockGame = { _playerA: playerA, _playerB: playerB } as Game;

      expect(getPlayers.call(mockGame)).toStrictEqual(['playerA', 'playerB']);
   });

   test('returns null for playerA if they do not exist', () => {
      const playerB = { username: 'playerB' } as Client;
      const mockGame = { _playerA: null, _playerB: playerB } as Game;

      expect(getPlayers.call(mockGame)).toStrictEqual([null, 'playerB']);
      expect(getPlayers.call({ _playerB: playerB } as Game)).toStrictEqual([
         null,
         'playerB',
      ]);
   });

   test('returns null for playerB if they do not exist', () => {
      const playerA = { username: 'playerA' } as Client;
      const mockGame = { _playerA: playerA, _playerB: null } as Game;

      expect(getPlayers.call(mockGame)).toStrictEqual(['playerA', null]);
      expect(getPlayers.call({ _playerA: playerA } as Game)).toStrictEqual([
         'playerA',
         null,
      ]);
   });

   test('returns null for both players if neither exists', () => {
      const mockGame = { _playerA: null, _playerB: null } as Game;

      expect(getPlayers.call(mockGame)).toStrictEqual([null, null]);
      expect(getPlayers.call({} as Game)).toStrictEqual([null, null]);
   });
});
