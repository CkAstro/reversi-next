/** @jest-environment node */

import { getGame } from '@/lib/game/cacheInterface';
import { complete } from '../complete';
import type { Game } from '@/lib/game/Game';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { ReversiGame } from '@/lib/mongodb/reversiGame';
import { logger } from '@/lib/utils/logger';

jest.mock('@/lib/game/cacheInterface', () => ({
   getGame: jest.fn(),
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

jest.mock('@/lib/mongodb/reversiGame', () => ({
   ReversiGame: jest.fn(() => ({
      save: jest.fn().mockResolvedValue(undefined),
   })),
}));

jest.mock('@/lib/mongodb/mongoose', () => ({
   connectToDatabase: jest.fn(),
}));

describe('complete', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('returns undefined if game does not exist', () => {
      (getGame as jest.Mock).mockReturnValue(null);

      expect(complete('mockGame')).toBe(undefined);
   });

   test('calls logger and returns if player is not present', () => {
      const mockGame = {
         getPlayers: jest.fn(),
      } as unknown as Game;
      (getGame as jest.Mock).mockReturnValue(mockGame);
      (mockGame.getPlayers as jest.Mock)
         .mockReturnValueOnce([null, 'playerB'])
         .mockReturnValueOnce(['playerA', null])
         .mockReturnValueOnce([null, null]);
   });

   test('calls for game completion and retrieves final score', () => {
      const mockGame = {
         getPlayers: jest.fn(() => ['playerA', 'playerB']),
         completeGame: jest.fn(),
         getScore: jest.fn(() => [1, 2]),
         getReducedHistory: jest.fn(),
         getBoardState: jest.fn(),
      } as unknown as Game;
      (getGame as jest.Mock).mockReturnValue(mockGame);

      complete('mockGame');
      expect(mockGame.completeGame).toHaveBeenCalled();
      expect(mockGame.getScore).toHaveBeenCalled();
   });

   test('connects to database and saves game', async () => {
      const mockPlayers = ['playerA', 'playerB'];
      const mockHistory = [1, 2, 3];
      const mockBoardState = [null, 1, 2];
      const mockGame = {
         gameId: 'mockGame',
         getPlayers: jest.fn(() => mockPlayers),
         completeGame: jest.fn(),
         getScore: jest.fn(() => [1, 2]),
         getReducedHistory: jest.fn(() => mockHistory),
         getBoardState: jest.fn(() => mockBoardState),
         firstTurn: 1,
         startTime: 1,
         endTime: 2,
      } as unknown as Game;
      (getGame as jest.Mock).mockReturnValue(mockGame);

      await complete('mockGame'); // await for the .then statement
      expect(connectToDatabase).toHaveBeenCalled();

      const saveMock = (ReversiGame as unknown as jest.Mock).mock.calls[0][0];
      expect(saveMock).toStrictEqual({
         gameId: 'mockGame',
         moveHistory: mockHistory,
         finalState: mockBoardState,
         playerA: mockPlayers[0],
         playerB: mockPlayers[1],
         firstTurn: 1,
         winner: -1,
         score: [1, 2],
         startTime: 1,
         endTime: 2,
      });
      expect(logger).toHaveBeenCalledWith(
         'game mockGame successfully saved to database'
      );
   });
});
