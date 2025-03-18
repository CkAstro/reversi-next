import { addPendingGame } from '@/lib/game/gameCache';
import { createGame } from '../createGame';
import { logger } from '@/lib/utils/logger';
import type { Reversi } from '@/types/reversi';

jest.mock('@/lib/game/gameCache', () => ({
   addPendingGame: jest.fn(),
}));

jest.mock('@/lib/boardState/createNewBoard', () => ({
   createNewBoard: () => Array.from({ length: 64 }, () => null),
}));

jest.mock('@/lib/utils/getRandomId', () => ({
   getRandomId: () => 'randomId',
}));

jest.mock('@/lib/utils/logger', () => ({
   logger: jest.fn(),
}));

describe('createGame', () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   test('callback has correct values', () => {
      // set up random values [< 0.5, < 0.5]
      jest
         .spyOn(global.Math, 'random')
         .mockReturnValueOnce(0.2)
         .mockReturnValueOnce(0.2);

      const callback = jest.fn();
      createGame('testPlayer', callback);
      expect(callback).toHaveBeenCalledWith({ gameId: 'randomId', role: 1 });
   });

   test('"addPendingGame" shows game is created successfully', () => {
      // set up random values [< 0.5, < 0.5]
      jest
         .spyOn(global.Math, 'random')
         .mockReturnValueOnce(0.2)
         .mockReturnValueOnce(0.2);

      const expectedGame: Reversi['Game'] = {
         gameId: 'randomId',
         boardState: Array.from({ length: 64 }, () => null),
         moveHistory: [],
         turn: 1,
         gameStatus: 'waiting',
         playerA: {
            playerId: 'testPlayer',
            username: 'no username',
            role: 1,
         },
         playerB: null,
         observers: [],
      };

      createGame('testPlayer', () => undefined);
      expect((addPendingGame as jest.Mock).mock.calls[0][0]).toStrictEqual(
         expectedGame
      );
   });

   test('all init combos work as expected', () => {
      jest
         .spyOn(global.Math, 'random')
         .mockReturnValueOnce(0.2) // [ < 0.5, < 0.5 ]
         .mockReturnValueOnce(0.2)
         .mockReturnValueOnce(0.2) // [ < 0.5, > 0.5 ]
         .mockReturnValueOnce(0.7)
         .mockReturnValueOnce(0.7) // [ > 0.5, < 0.5 ]
         .mockReturnValueOnce(0.2)
         .mockReturnValueOnce(0.7) // [ > 0.5, > 0.5 ]
         .mockReturnValueOnce(0.7);

      const callback = jest.fn();
      createGame('testPlayer', callback);
      createGame('testPlayer', callback);
      createGame('testPlayer', callback);
      createGame('testPlayer', callback);

      // first should be player1: 1, turn: 1
      expect((addPendingGame as jest.Mock).mock.calls[0][0].turn).toBe(1);
      expect((addPendingGame as jest.Mock).mock.calls[0][0].playerA.role).toBe(
         1
      );
      // first should be player1: 1, turn: -1
      expect((addPendingGame as jest.Mock).mock.calls[1][0].turn).toBe(-1);
      expect((addPendingGame as jest.Mock).mock.calls[1][0].playerA.role).toBe(
         1
      );
      // first should be player1: -1, turn: 1
      expect((addPendingGame as jest.Mock).mock.calls[2][0].turn).toBe(1);
      expect((addPendingGame as jest.Mock).mock.calls[2][0].playerA.role).toBe(
         -1
      );
      // first should be player1: -1, turn: -1
      expect((addPendingGame as jest.Mock).mock.calls[3][0].turn).toBe(-1);
      expect((addPendingGame as jest.Mock).mock.calls[3][0].playerA.role).toBe(
         -1
      );
   });

   test('game creation is logged', () => {
      createGame('testPlayer', () => undefined);
      expect(logger).toHaveBeenCalled();
   });
});
