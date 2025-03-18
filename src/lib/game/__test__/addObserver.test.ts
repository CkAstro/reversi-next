import { addObserver } from '../addObserver';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

const mockGame = {
   gameId: 'testGameId',
   observers: [],
};

jest.mock('../gameCache', () => ({
   getGame: (gameId: Reversi['GameId']) =>
      gameId === 'testGameId' ? mockGame : null,
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('addObserver', () => {
   const gameId = 'testGameId';
   const playerId = 'testPlayerId';

   beforeEach(() => {
      mockGame.observers = [];
      jest.clearAllMocks();
   });

   test('callback should contain error if game does not exist', () => {
      const callback = jest.fn();
      addObserver('wrongGameId', playerId, callback);

      expect(callback).toHaveBeenCalledWith({ error: 'Game does not exist.' });
   });

   test('should add observer with no error', () => {
      const callback = jest.fn();
      addObserver(gameId, playerId, callback);

      expect(mockGame.observers).toHaveLength(1);
      expect(mockGame.observers[0]).toEqual({
         playerId,
         username: 'no username',
         role: 0,
      });

      expect(callback).toHaveBeenCalledWith({});
   });

   test('should log event', () => {
      const callback = jest.fn();
      addObserver(gameId, playerId, callback);

      expect(logger).toHaveBeenCalledTimes(1);
   });
});
