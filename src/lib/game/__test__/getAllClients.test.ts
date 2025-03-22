import { getAllClients } from '../getAllClients';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const createMockClient = (playerId: string) =>
   ({
      playerId,
   } as unknown as Client);

const createMockGame = () =>
   ({
      _playerA: null,
      _playerB: null,
      _observers: new Map<Reversi['PlayerId'], Client>(),
   } as unknown as Game);

describe('Game - assignToGame', () => {
   test('returns all players and observers in order', () => {
      const playerA = createMockClient('playerA');
      const playerB = createMockClient('playerB');
      const observer1 = createMockClient('observer1');
      const observer2 = createMockClient('observer2');

      const mockGame = createMockGame();
      mockGame._playerA = playerA;
      mockGame._playerB = playerB;
      mockGame._observers.set(observer1.playerId, observer1);
      mockGame._observers.set(observer2.playerId, observer2);

      const expectedResult = [playerA, playerB, observer1, observer2];
      const clients = getAllClients.call(mockGame);

      expect(clients).toStrictEqual(expectedResult);
   });

   test('only returns players if they exist', () => {
      const observer1 = createMockClient('observer1');
      const observer2 = createMockClient('observer2');

      const mockGame = createMockGame();
      mockGame._observers.set(observer1.playerId, observer1);
      mockGame._observers.set(observer2.playerId, observer2);

      const expectedResult = [observer1, observer2];
      const clients = getAllClients.call(mockGame);

      expect(clients).toStrictEqual(expectedResult);
   });
});
