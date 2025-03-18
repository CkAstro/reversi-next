import { completeGame } from '../completeGame';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

const mockActiveGames: Reversi['GameId'][] = ['game1', 'game2'];
const mockCompletedGames: Reversi['GameId'][] = [];

jest.mock('../gameCache', () => ({
   upgradeActiveGame: (gameId: Reversi['GameId']) => {
      const gameIndex = mockActiveGames.indexOf(gameId);
      if (gameIndex === -1) return false;
      mockActiveGames.splice(gameIndex, 1);
      mockCompletedGames.unshift(gameId);
      return true;
   },
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('completeGame', () => {
   beforeEach(() => {
      while (mockActiveGames.length > 0) mockActiveGames.pop();
      while (mockCompletedGames.length > 0) mockCompletedGames.pop();
      mockActiveGames.push('game1', 'game2');

      jest.clearAllMocks();
   });

   test('should complete game successfully', () => {
      const callback = jest.fn();
      completeGame('game1', callback);

      expect(mockActiveGames).toStrictEqual(['game2']);
      expect(mockCompletedGames).toStrictEqual(['game1']);

      expect(callback).toHaveBeenCalledWith({});
   });

   test('logger records completion', () => {
      const callback = jest.fn();
      completeGame('game1', callback);

      expect(logger).toHaveBeenCalledWith('successfully completed game game1');
   });

   test('returns error if game is not in activeGame list', () => {
      const callback = jest.fn();
      completeGame('game3', callback);

      expect(mockActiveGames).toStrictEqual(['game1', 'game2']);
      expect(mockCompletedGames).toStrictEqual([]);

      expect(callback).toHaveBeenCalledWith({
         error: 'Encountered an issue while completing game.',
      });
      expect(logger).toHaveBeenCalledWith('unable to complete game game3');
   });
});
