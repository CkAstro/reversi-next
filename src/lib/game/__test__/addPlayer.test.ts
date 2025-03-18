import { addPlayer, _forTesting } from '@/lib/game/addPlayer';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

const mockGame: Pick<Reversi['Game'], 'gameId' | 'playerA' | 'playerB'> = {
   gameId: 'testGameId',
   playerA: null,
   playerB: null,
};

jest.mock('../gameCache', () => ({
   getGame: (gameId: Reversi['GameId']) =>
      gameId === 'testGameId' ? mockGame : null,
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('assignPlayerToGame', () => {
   const playerId = 'testPlayerId';

   beforeEach(() => {
      mockGame.playerA = null;
      mockGame.playerB = null;
      jest.clearAllMocks();
   });

   test('adding player to first functions', () => {
      mockGame.playerB = {
         playerId: 'playerB',
         username: 'playerB',
         role: 1,
      };

      expect(
         _forTesting.assignPlayerToGame(
            mockGame as unknown as Reversi['Game'],
            true,
            playerId,
            'testPlayer'
         )
      ).toBe(-1);

      expect(mockGame.playerA).toStrictEqual({
         playerId,
         username: 'testPlayer',
         role: -1,
      });
   });

   test('adding player to second functions', () => {
      mockGame.playerA = {
         playerId: 'playerA',
         username: 'playerA',
         role: 1,
      };

      expect(
         _forTesting.assignPlayerToGame(
            mockGame as unknown as Reversi['Game'],
            false,
            playerId,
            'testPlayer'
         )
      ).toBe(-1);

      expect(mockGame.playerB).toStrictEqual({
         playerId,
         username: 'testPlayer',
         role: -1,
      });
   });

   test('no error if no player is present', () => {
      expect(
         _forTesting.assignPlayerToGame(
            mockGame as unknown as Reversi['Game'],
            true,
            playerId,
            'testPlayer'
         )
      ).toBe(1);

      expect(mockGame.playerA).toStrictEqual({
         playerId,
         username: 'testPlayer',
         role: 1,
      });
   });

   test('assignment is logged', () => {
      _forTesting.assignPlayerToGame(
         mockGame as unknown as Reversi['Game'],
         true,
         playerId,
         'testPlayer'
      );

      expect(logger).toHaveBeenCalledTimes(1);
   });
});

describe('addPlayer', () => {
   const gameId = 'testGameId';
   const playerId = 'testPlayerId';

   beforeEach(() => {
      mockGame.playerA = null;
      mockGame.playerB = null;
      jest.clearAllMocks();
   });

   test('error if game does not exist', () => {
      const callback = jest.fn();
      addPlayer('wrongGameId', playerId, callback);

      expect(callback).toHaveBeenCalledWith({
         error: 'Game does not exist.',
      });
   });

   test('error if game is full', () => {
      const callback = jest.fn();
      mockGame.playerA = {
         playerId: 'playerA',
         username: 'playerA',
         role: 1,
      };
      mockGame.playerB = {
         playerId: 'playerB',
         username: 'playerB',
         role: -1,
      };

      addPlayer(gameId, playerId, callback);
      expect(mockGame.playerA).toStrictEqual({
         playerId: 'playerA',
         username: 'playerA',
         role: 1,
      });
      expect(mockGame.playerB).toStrictEqual({
         playerId: 'playerB',
         username: 'playerB',
         role: -1,
      });

      expect(callback).toHaveBeenCalledWith({
         error: 'Game is full.',
      });
   });

   test('callback with role and opponent if successful', () => {
      const callback = jest.fn();
      mockGame.playerA = {
         playerId: 'playerA',
         username: 'playerA',
         role: 1,
      };

      addPlayer(gameId, playerId, callback);
      expect(mockGame.playerB).toStrictEqual({
         playerId,
         username: 'no username',
         role: -1,
      });
      expect(callback).toHaveBeenCalledWith({
         role: -1,
         opponentId: 'playerA',
      });
   });
});
