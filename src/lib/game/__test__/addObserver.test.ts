/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { addObserver } from '../addObserver';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const createMockGame = () =>
   ({
      _observers: new Map<Reversi['PlayerId'], Client>(),
      _assignToGame: jest.fn(),
   } as unknown as Game);

describe('Game - assignToGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test('adds observer', () => {
      const mockGame = createMockGame();
      const mockClient = { playerId: 'mockClient' } as Client;

      addObserver.call(mockGame, mockClient);
      expect(mockGame._assignToGame).toHaveBeenCalledWith(mockClient, 0);
   });

   test('does nothing if observer is present', () => {
      const mockGame = createMockGame();
      const mockClient = { playerId: 'mockClient' } as Client;
      mockGame._observers.set('mockClient', mockClient);

      addObserver.call(mockGame, mockClient);
      expect(mockGame._assignToGame).not.toHaveBeenCalled();
   });
});
