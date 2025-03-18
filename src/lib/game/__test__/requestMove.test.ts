// Import function and dependencies
import { requestMove } from '../requestMove';
import { validateMove } from '@/lib/validateMove';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

// Mock dependencies
const validGameId = 'testGame';
const playerId = 'testPlayer';
const mockBoardState: Reversi['BoardState'] = Array.from(
   { length: 64 },
   () => null
);

const validMove = 5;
const invalidMove = 3;

// mock functions
jest.mock('../gameCache', () => ({
   getGame: jest.fn((gameId: Reversi['GameId']) =>
      gameId === validGameId
         ? {
              boardState: mockBoardState,
              playerA: { playerId: 'testPlayer', role: 1 },
              playerB: { playerId: 'playerB', role: -1 },
           }
         : null
   ),
}));

jest.mock('@/lib/validateMove', () => ({
   validateMove: jest.fn(
      (boardState: Reversi['BoardState'], role, moveIndex) => {
         if (moveIndex !== validMove) return null;
         return boardState.map((square, i) =>
            i === validMove ? role : square
         );
      }
   ),
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('requestMove', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('should return new board state if move is valid', () => {
      const callback = jest.fn();
      expect(mockBoardState[validMove]).not.toBe(1);
      requestMove(validGameId, playerId, validMove, callback);

      const expectedBoardState = [...mockBoardState];
      expectedBoardState[validMove] = 1;

      expect(validateMove).toHaveBeenCalledWith(mockBoardState, 1, validMove);
      expect(callback).toHaveBeenCalledWith({ boardState: expectedBoardState });
   });

   test('return error if game does not exist', () => {
      const callback = jest.fn();
      requestMove('invalidGameId', playerId, validMove, callback);

      expect(callback).toHaveBeenCalledWith({ error: 'Game does not exist.' });
   });

   test('return error if player is not in the game', () => {
      const callback = jest.fn();
      requestMove(validGameId, 'invalidPlayer', validMove, callback);

      expect(callback).toHaveBeenCalledWith({
         error: 'Player is not active in this game.',
      });
   });

   test('return error if move is not allowed', () => {
      const callback = jest.fn();
      requestMove(validGameId, playerId, invalidMove, callback);

      expect(validateMove).toHaveBeenCalledWith(mockBoardState, 1, invalidMove);
      expect(callback).toHaveBeenCalledWith({ error: 'Move not allowed.' });
   });

   test('should log the move request', () => {
      const callback = jest.fn();
      requestMove(validGameId, playerId, validMove, callback);

      expect(logger).toHaveBeenCalledWith(
         `player ${playerId} requested move ${validMove} in game ${validGameId}`
      );
   });
});
