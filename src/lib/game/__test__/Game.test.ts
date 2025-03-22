import { createGame } from '../Game';
import type { Client } from '@/lib/client/Client';
// import { getRandomId } from '@/lib/utils/getRandomId';
// import { createNewBoard } from '@/lib/boardState/createNewBoard';
// import { addPendingGame } from '@/lib/game/gameCache';
// import { validateMove } from '@/lib/validateMove';

const createMockClient = (playerId: string) =>
   ({
      playerId,
      setGame: jest.fn(),
      setCurrentRole: jest.fn(),
      setOpponent: jest.fn(),
   } as unknown as Client);

jest.mock('@/lib/utils/getRandomId', () => ({
   getRandomId: jest.fn(() => 'mockId'),
}));

describe('Game', () => {
   test('game inits with expected properties', () => {
      const mockClient = createMockClient('mockClient');
      const game = createGame(mockClient);

      expect(game.gameId).toBe('mockId');
   });
});
