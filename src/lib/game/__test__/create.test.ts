import type { Client } from '@/lib/client/Client';
import { createGame } from '@/lib/game/Game';
import { create } from '../create';
import type { Reversi } from '@/types/reversi';

jest.mock('@/lib/game/Game', () => ({
   createGame: jest.fn((client: Client) => {
      const role = Math.random() < 0.5 ? 1 : -1;

      return {
         gameId: 'testGame',
         playerA: role === 1 ? client.playerId : null,
         playerB: role === 1 ? null : client.playerId,
         getRoleById: (_playerId: Reversi['PlayerId']) => role,
      };
   }),
}));

describe('create', () => {
   const client = { playerId: 'testPlayer' } as unknown as Client;

   beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
   });

   test('game creates', () => {
      const callback = jest.fn();
      create(client, callback);

      expect(createGame).toHaveBeenCalledWith(client);
      expect(callback).toHaveBeenCalled();
   });

   test('role 1 returns correctly', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.2); // force role = 1

      const callback = jest.fn();
      create(client, callback);

      expect(callback).toHaveBeenCalledWith('testGame', 1);
   });

   test('role -1 returns correctly', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.8); // force role = -1

      const callback = jest.fn();
      create(client, callback);

      expect(callback).toHaveBeenCalledWith('testGame', -1);
   });
});
