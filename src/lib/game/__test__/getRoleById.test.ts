/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { getRoleById } from '../getRoleById';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';

describe('Game - assignToGame', () => {
   const mockGame = {
      _playerA: { playerId: 'playerA' },
      _playerB: { playerId: 'playerB' },
      _observers: new Map<string, Client>(),
   } as Game;
   mockGame._observers.set('observer1', {} as Client);

   test('returns 1 if id matches playerA', () => {
      expect(getRoleById.call(mockGame, 'playerA')).toBe(1);
   });

   test('returns -1 if id matches playerB', () => {
      expect(getRoleById.call(mockGame, 'playerB')).toBe(-1);
   });

   test('returns 0 if id matches an observer', () => {
      expect(getRoleById.call(mockGame, 'observer1')).toBe(0);
   });

   test('returns null if id does not match', () => {
      expect(getRoleById.call(mockGame, 'observer2')).toBe(null);
   });
});
