/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { addPlayer } from '../addPlayer';
import type { Game } from '@/lib/game/Game';
import type { Client } from '@/lib/client/Client';
import type { Reversi } from '@/types/reversi';

const createMockClient = (playerId: string) =>
   ({
      playerId,
   } as unknown as Client);

const createMockGame = () =>
   ({
      _playerA: null,
      _playerB: null,
      _observers: new Map<Reversi['PlayerId'], Client>(),
      getRoleById: jest.fn(),
      addObserver: jest.fn(),
      _assignToGame: jest.fn(),
   } as unknown as Game);

describe('Game - assignToGame', () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test('assigns to playerA and returns 1 if game is empty', () => {
      const mockClient = createMockClient('mockClient');
      const mockGame = createMockGame();

      (mockGame.getRoleById as jest.Mock).mockReturnValue(null);
      addPlayer.call(mockGame, mockClient);

      expect(mockGame._assignToGame).toHaveBeenCalledWith(mockClient, 1);
      expect(mockGame.getRoleById).toHaveBeenCalledWith('mockClient');
      expect(mockGame.addObserver).not.toHaveBeenCalled();
   });

   test('assigns to playerA and returns 1 if slot is free', () => {
      const mockClient = createMockClient('mockClient');
      const mockGame = createMockGame();
      mockGame._playerB = {} as Client;

      (mockGame.getRoleById as jest.Mock).mockReturnValue(null);
      addPlayer.call(mockGame, mockClient);

      expect(mockGame._assignToGame).toHaveBeenCalledWith(mockClient, 1);
      expect(mockGame.getRoleById).toHaveBeenCalledWith('mockClient');
      expect(mockGame.addObserver).not.toHaveBeenCalled();
   });

   test('assigns to playerB and returns -1 if playerA is full', () => {
      const mockClient = createMockClient('mockClient');
      const mockGame = createMockGame();
      mockGame._playerA = {} as Client;

      (mockGame.getRoleById as jest.Mock).mockReturnValue(null);
      addPlayer.call(mockGame, mockClient);

      expect(mockGame._assignToGame).toHaveBeenCalledWith(mockClient, -1);
      expect(mockGame.getRoleById).toHaveBeenCalledWith('mockClient');
      expect(mockGame.addObserver).not.toHaveBeenCalled();
   });

   test('assigns to observer and returns 0 if both slots are full', () => {
      const mockClient = createMockClient('mockClient');
      const mockGame = createMockGame();
      mockGame._playerA = {} as Client;
      mockGame._playerB = {} as Client;

      (mockGame.getRoleById as jest.Mock).mockReturnValue(null);
      addPlayer.call(mockGame, mockClient);

      expect(mockGame._assignToGame).not.toHaveBeenCalled();
      expect(mockGame.getRoleById).toHaveBeenCalledWith('mockClient');
      expect(mockGame.addObserver).toHaveBeenCalledWith(mockClient);
   });

   test('assigns to current role if playerId is already in game', () => {
      const mockClient = createMockClient('mockClient');
      const mockGame = createMockGame();

      // add a separate client with the same playerId
      const previousClient = { playerId: 'mockClient' } as Client;
      mockGame._playerA = previousClient;

      (mockGame.getRoleById as jest.Mock).mockReturnValue(1);
      addPlayer.call(mockGame, mockClient);

      expect(mockGame.getRoleById).toHaveBeenCalledWith('mockClient');
      expect(mockGame._assignToGame).toHaveBeenCalledWith(mockClient, 1);
      expect(mockGame.addObserver).not.toHaveBeenCalled();
   });
});
