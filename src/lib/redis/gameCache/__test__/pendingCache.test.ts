import {
   createAddToPending,
   createRemoveFromPending,
   createGetPending,
} from '../pendingCache';
import type Redis from 'ioredis';

const mockRedis = {
   hset: jest.fn(),
   hdel: jest.fn(),
   hmget: jest.fn(),
   lpush: jest.fn(),
   lrem: jest.fn(),
   lrange: jest.fn(),
};

describe('addToPending', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('adds new entry', async () => {
      mockRedis.hset.mockResolvedValue(1);
      mockRedis.lpush.mockResolvedValue(1);

      const addToPending = createAddToPending(mockRedis as unknown as Redis);
      const result = await addToPending('mockGame', 'mockPlayer');

      expect(result).toBe(true);
      expect(mockRedis.hset).toHaveBeenCalledWith(
         'cache:pending:data',
         'mockGame',
         JSON.stringify({ gameId: 'mockGame', player: 'mockPlayer' })
      );
      expect(mockRedis.lpush).toHaveBeenCalledWith(
         'cache:pending:keys',
         'mockGame'
      );
   });

   test('returns false if already set', async () => {
      mockRedis.hset.mockResolvedValue(0);
      mockRedis.lpush.mockResolvedValue(1);

      const addToPending = createAddToPending(mockRedis as unknown as Redis);
      const result = await addToPending('mockGame', 'mockPlayer');

      expect(result).toBe(false);
      expect(mockRedis.lpush).not.toHaveBeenCalled();
   });
});

describe('removeFromPending', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('removes entry', async () => {
      mockRedis.hdel.mockResolvedValue(1);
      mockRedis.lrem.mockResolvedValue(1);

      const removedFromPending = createRemoveFromPending(
         mockRedis as unknown as Redis
      );
      const result = await removedFromPending('mockGame');

      expect(result).toBe(true);
      expect(mockRedis.hdel).toHaveBeenCalledWith(
         'cache:pending:data',
         'mockGame'
      );
      expect(mockRedis.lrem).toHaveBeenCalledWith(
         'cache:pending:keys',
         0,
         'mockGame'
      );
   });

   test('returns false if does not exist', async () => {
      mockRedis.hdel.mockResolvedValue(0);
      mockRedis.lrem.mockResolvedValue(0);

      const removedFromPending = createRemoveFromPending(
         mockRedis as unknown as Redis
      );
      const result = await removedFromPending('mockGame');

      expect(result).toBe(false);
      expect(mockRedis.hdel).toHaveBeenCalled();
   });
});

describe('getPending', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('returns parsed entries', async () => {
      const mockPayload = [
         { gameId: 'mockGame1', player: 'mockPlayer1' },
         {
            gameId: 'mockGame2',
            player: 'mockPlayer2',
         },
      ];
      mockRedis.hmget.mockResolvedValue(
         mockPayload.map((item) => JSON.stringify(item))
      );
      mockRedis.lrange.mockResolvedValue(['mockGame1', 'mockGame2']);

      const getPending = createGetPending(mockRedis as unknown as Redis);
      const result = await getPending(10, 0);

      expect(result).toStrictEqual(mockPayload);
      expect(mockRedis.lrange).toHaveBeenCalledWith('cache:pending:keys', 0, 9);
      expect(mockRedis.hmget).toHaveBeenCalledWith(
         'cache:pending:data',
         'mockGame1',
         'mockGame2'
      );
   });

   test('paginates correctly', async () => {
      mockRedis.hmget.mockResolvedValue([]);
      mockRedis.lrange.mockResolvedValue([]);

      const getPending = createGetPending(mockRedis as unknown as Redis);

      await getPending(10, 1);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:pending:keys',
         10,
         19
      );

      await getPending(5, 3);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:pending:keys',
         15,
         19
      );
   });
});
