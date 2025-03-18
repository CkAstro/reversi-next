import { removeObserver } from '@/lib/game/removeObserver';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

const mockGame = {
   gameId: 'testGameId',
   observers: [
      { playerId: 'testPlayerId', username: 'observer1', role: 0 },
      { playerId: 'observer2', username: 'observer2', role: 0 },
   ],
};

jest.mock('../gameCache', () => ({
   getGame: (gameId: Reversi['GameId']) =>
      gameId === 'testGameId' ? mockGame : null,
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('removeObserver', () => {
   const gameId = 'testGameId';
   const playerId = 'testPlayerId';

   beforeEach(() => {
      mockGame.observers = [
         { playerId: 'testPlayerId', username: 'observer1', role: 0 },
         { playerId: 'observer2', username: 'observer2', role: 0 },
      ];
      jest.clearAllMocks();
   });

   test('callback should contain error if game does not exist', () => {
      const callback = jest.fn();
      removeObserver('wrongGameId', playerId, callback);

      expect(callback).toHaveBeenCalledWith({ error: 'Game does not exist.' });
   });

   test('should return error if observer does not exist', () => {
      expect(mockGame.observers).toHaveLength(2);

      const callback = jest.fn();
      removeObserver(gameId, 'wrongPlayerId', callback);
      expect(mockGame.observers).toHaveLength(2);
      expect(callback).toHaveBeenCalledWith({
         error: 'player is not observing this game.',
      });
   });

   test('should remove observer with no error', () => {
      const callback = jest.fn();
      removeObserver(gameId, playerId, callback);

      expect(mockGame.observers).toHaveLength(1);
      expect(mockGame.observers[0]).toEqual({
         playerId: 'observer2',
         username: 'observer2',
         role: 0,
      });

      expect(callback).toHaveBeenCalledWith({});
   });

   test('should log event', () => {
      const callback = jest.fn();
      removeObserver(gameId, playerId, callback);

      expect(logger).toHaveBeenCalledTimes(1);
   });
});
