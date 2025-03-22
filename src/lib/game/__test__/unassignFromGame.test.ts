// cSpell:words unassigning
import { unassignFromGame } from '../unassignFromGame';
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
      getRoleById: jest.fn(),
   } as unknown as Game);

describe('Game - unassignFromGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test('returns 1 when unassigning client from playerA', () => {
      const client = createMockClient('testClient');
      const game = createMockGame('testGame');
      game._playerA = client;
      expect(game._playerA).toBe(client);

      (game.getRoleById as jest.Mock).mockReturnValue(1);
      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = unassignFromGame.call(game, client);
      expect(value).toBe(1);

      expect(game._playerA).toBe(null);
      expect(game._playerB).toBe(null);
      expect(game._observers.size).toBe(0);
      expect(client.setGame).toHaveBeenCalledWith(null);
      expect(client.setCurrentRole).toHaveBeenCalledWith(null);
      expect(client.setOpponent).toHaveBeenCalledWith(null);
   });

   test('returns -1 when unassigning client from playerB', () => {
      const client = createMockClient('testClient');
      const game = createMockGame('testGame');
      game._playerB = client;
      expect(game._playerB).toBe(client);

      (game.getRoleById as jest.Mock).mockReturnValue(-1);
      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = unassignFromGame.call(game, client);
      expect(value).toBe(-1);

      expect(game._playerA).toBe(null);
      expect(game._playerB).toBe(null);
      expect(game._observers.size).toBe(0);
      expect(client.setGame).toHaveBeenCalledWith(null);
      expect(client.setCurrentRole).toHaveBeenCalledWith(null);
      expect(client.setOpponent).toHaveBeenCalledWith(null);
   });

   test('returns 0 when unassigning client from observers', () => {
      const client = createMockClient('testClient');
      const game = createMockGame('testGame');
      game._observers.set(client.playerId, client);
      expect(game._observers.size).toBe(1);

      (game.getRoleById as jest.Mock).mockReturnValue(0);
      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = unassignFromGame.call(game, client);
      expect(value).toBe(0);

      expect(game._playerA).toBe(null);
      expect(game._playerB).toBe(null);
      expect(game._observers.size).toBe(0);
      expect(client.setGame).toHaveBeenCalledWith(null);
      expect(client.setCurrentRole).toHaveBeenCalledWith(null);
      expect(client.setOpponent).toHaveBeenCalledWith(null);
   });

   test('returns null if client is not in game', () => {
      const client = createMockClient('testClient');
      const game = createMockGame('testGame');

      (game.getRoleById as jest.Mock).mockReturnValue(null);
      (game.getOpponentByRole as jest.Mock).mockReturnValue(null);
      const value = unassignFromGame.call(game, client);
      expect(value).toBe(null);

      expect(game._playerA).toBe(null);
      expect(game._playerB).toBe(null);
      expect(game._observers.size).toBe(0);
      expect(client.setGame).not.toHaveBeenCalled();
      expect(client.setCurrentRole).not.toHaveBeenCalled();
      expect(client.setOpponent).not.toHaveBeenCalled();
   });

   test('removes opponent relationship when opponent exists', () => {
      const mockClient = {
         playerId: 'testClient',
         opponent: null as unknown,
         setGame: jest.fn(),
         setCurrentRole: jest.fn(),
         setOpponent: jest.fn(),
      };
      const mockOpponent = {
         setOpponent: jest.fn(),
      };

      mockClient.opponent = mockOpponent;

      const game = createMockGame('testGame');
      game._playerA = mockClient as unknown as Client;
      game._playerB = mockOpponent as unknown as Client;

      (game.getRoleById as jest.Mock).mockReturnValue(1);
      (game.getOpponentByRole as jest.Mock).mockReturnValue(mockOpponent);
      unassignFromGame.call(game, mockClient as unknown as Client);

      expect(game._playerA).toBe(null);
      expect(game._playerB).toBe(mockOpponent);
      expect(mockClient.setOpponent).toHaveBeenCalledWith(null);
      expect(mockOpponent.setOpponent).toHaveBeenCalledWith(null);
   });
});
