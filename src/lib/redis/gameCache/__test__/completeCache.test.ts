import {
   createAddToComplete,
   createRemoveFromComplete,
   createGetComplete,
} from '../completeCache';
import type Redis from 'ioredis';

const mockRedis = {
   hset: jest.fn(),
   hdel: jest.fn(),
   hmget: jest.fn(),
   lpush: jest.fn(),
   lrem: jest.fn(),
   lrange: jest.fn(),
};

describe('addToComplete', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('adds new entry', async () => {
      mockRedis.hset.mockResolvedValue(1);
      mockRedis.lpush.mockResolvedValue(1);

      const addToComplete = createAddToComplete(mockRedis as unknown as Redis);
      const result = await addToComplete(
         'mockGame',
         'mockPlayerA',
         'mockPlayerB',
         [1, 2]
      );

      expect(result).toBe(true);
      expect(mockRedis.hset).toHaveBeenCalledWith(
         'cache:complete:data',
         'mockGame',
         JSON.stringify({
            gameId: 'mockGame',
            playerA: 'mockPlayerA',
            playerB: 'mockPlayerB',
            score: [1, 2],
         })
      );
      expect(mockRedis.lpush).toHaveBeenCalledWith(
         'cache:complete:keys',
         'mockGame'
      );
   });

   test('returns false if already set', async () => {
      mockRedis.hset.mockResolvedValue(0);
      mockRedis.lpush.mockResolvedValue(1);

      const addToComplete = createAddToComplete(mockRedis as unknown as Redis);
      const result = await addToComplete(
         'mockGame',
         'mockPlayerA',
         'mockPlayerB',
         [1, 2]
      );

      expect(result).toBe(false);
      expect(mockRedis.lpush).not.toHaveBeenCalled();
   });
});

describe('removeFromComplete', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('removes entry', async () => {
      mockRedis.hdel.mockResolvedValue(1);
      mockRedis.lrem.mockResolvedValue(1);

      const removedFromComplete = createRemoveFromComplete(
         mockRedis as unknown as Redis
      );
      const result = await removedFromComplete('mockGame');

      expect(result).toBe(true);
      expect(mockRedis.hdel).toHaveBeenCalledWith(
         'cache:complete:data',
         'mockGame'
      );
      expect(mockRedis.lrem).toHaveBeenCalledWith(
         'cache:complete:keys',
         0,
         'mockGame'
      );
   });

   test('returns false if does not exist', async () => {
      mockRedis.hdel.mockResolvedValue(0);
      mockRedis.lrem.mockResolvedValue(0);

      const removedFromComplete = createRemoveFromComplete(
         mockRedis as unknown as Redis
      );
      const result = await removedFromComplete('mockGame');

      expect(result).toBe(false);
      expect(mockRedis.hdel).toHaveBeenCalled();
   });
});

describe('getComplete', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('returns parsed entries', async () => {
      const mockPayload = [
         {
            gameId: 'mockGame1',
            playerA: 'mockPlayerA',
            playerB: 'mockPlayerB',
            score: [1, 2],
         },
         {
            gameId: 'mockGame2',
            playerA: 'mockPlayer1',
            playerB: 'mockPlayer2',
            score: [3, 4],
         },
      ];
      mockRedis.hmget.mockResolvedValue(
         mockPayload.map((item) => JSON.stringify(item))
      );
      mockRedis.lrange.mockResolvedValue(['mockGame1', 'mockGame2']);

      const getComplete = createGetComplete(mockRedis as unknown as Redis);
      const result = await getComplete(10, 0);

      expect(result).toStrictEqual(mockPayload);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:complete:keys',
         0,
         9
      );
      expect(mockRedis.hmget).toHaveBeenCalledWith(
         'cache:complete:data',
         'mockGame1',
         'mockGame2'
      );
   });

   test('paginates correctly', async () => {
      mockRedis.hmget.mockResolvedValue([]);
      mockRedis.lrange.mockResolvedValue([]);

      const getComplete = createGetComplete(mockRedis as unknown as Redis);

      await getComplete(10, 1);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:complete:keys',
         10,
         19
      );

      await getComplete(5, 3);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:complete:keys',
         15,
         19
      );
   });
});
