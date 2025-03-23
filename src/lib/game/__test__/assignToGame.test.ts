import { assignToGame } from '../assignToGame';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const createMockClient = (playerId: string) =>
   ({
      playerId,
      setGame: jest.fn(),
      setCurrentRole: jest.fn(),
      setOpponent: jest.fn(),
   } as unknown as Client);

const createMockGame = (gameId: string) =>
   ({
      gameId,
      _playerA: null,
      _playerB: null,
      _observers: new Map<Reversi['PlayerId'], Client>(),
      getOpponentByRole: jest.fn(),
   } as unknown as Game);

describe('Game - assignToGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test('assigns client to playerA when role is 1', () => {
      const game = createMockGame('testGame');
      const client = createMockClient('testClient');
      const role = 1;

      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = assignToGame.call(game, client, role);
      expect(value).toBe(role);

      expect(game._playerA).toBe(client);
      expect(game._playerB).toBe(null);
      expect(game._observers.size).toBe(0);
      expect(client.setGame).toHaveBeenCalledWith(game);
      expect(client.setCurrentRole).toHaveBeenCalledWith(role);
      expect(client.setOpponent).toHaveBeenCalledWith(null);
   });

   test('assigns client to playerB when role is -1', () => {
      const game = createMockGame('testGame');
      const client = createMockClient('testClient');
      const role = -1;

      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = assignToGame.call(game, client, role);
      expect(value).toBe(role);

      expect(game._playerB).toBe(client);
      expect(game._playerA).toBe(null);
      expect(game._observers.size).toBe(0);
      expect(client.setGame).toHaveBeenCalledWith(game);
      expect(client.setCurrentRole).toHaveBeenCalledWith(role);
      expect(client.setOpponent).toHaveBeenCalledWith(null);
   });

   test('assigns client to observer when role is 0', () => {
      const game = createMockGame('testGame');
      const client = createMockClient('testClient');
      const role = 0;

      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = assignToGame.call(game, client, role);
      expect(value).toBe(role);

      expect(game._playerB).toBe(null);
      expect(game._playerA).toBe(null);
      expect(game._observers.size).toBe(1);
      expect(game._observers.get('testClient')).toBe(client);
      expect(client.setGame).toHaveBeenCalledWith(game);
      expect(client.setCurrentRole).toHaveBeenCalledWith(role);
      expect(client.setOpponent).toHaveBeenCalledWith(null);
   });

   test('sets opponent relationship when opponent exists', () => {
      const client = createMockClient('testClient');
      const opponent = createMockClient('testOpponent');

      const game = createMockGame('testGame');
      game._playerA = opponent;

      (game.getOpponentByRole as jest.Mock).mockReturnValue(opponent);
      assignToGame.call(game, client, -1);

      expect(game._playerA).toBe(opponent);
      expect(game._playerB).toBe(client);
      expect(client.setOpponent).toHaveBeenCalledWith(opponent);
      expect(opponent.setOpponent).toHaveBeenCalledWith(client);
   });
});
