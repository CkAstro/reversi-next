import { getBoardState } from '../getBoardState';
import type { Game } from '@/lib/game/Game';

const createMockGame = () =>
   ({
      _boardState: [null, 1, -1],
   } as unknown as Game);

describe('Game - assignToGame', () => {
   test('returns immutable board state', () => {
      const game = createMockGame();
      const boardState = getBoardState.call(game);
      expect(boardState).toStrictEqual(game._boardState);

      boardState[1] = -1;
      expect(boardState).not.toStrictEqual(game._boardState);
   });
});
