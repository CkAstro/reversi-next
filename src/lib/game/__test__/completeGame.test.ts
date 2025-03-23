/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { completeGame } from '../completeGame';
import { logger } from '@/lib/utils/logger';
import type { Game } from '@/lib/game/Game';

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('Game - startGame', () => {
   test('sets status and start time', () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1234);
      const mockGame = {
         _currentStatus: 'active',
         _startTime: null as number | null,
      } as Game;

      completeGame.call(mockGame);

      expect(logger).not.toHaveBeenCalled();
      expect(mockGame._currentStatus).toBe('complete');
      expect(mockGame._startTime).toBe(1234);
   });

   test('logs and returns if status is not active', () => {
      const mockGame = {
         _currentStatus: 'pending',
         _startTime: null as number | null,
      } as Game;

      completeGame.call(mockGame);

      expect(logger).toHaveBeenCalled();
      expect(mockGame._currentStatus).toBe('pending');
      expect(mockGame._startTime).toBe(null);
   });
});
