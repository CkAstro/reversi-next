import {
   createAddToActive,
   createRemoveFromActive,
   createGetActive,
} from '../activeCache';
import type Redis from 'ioredis';

const mockRedis = {
   hset: jest.fn(),
   hdel: jest.fn(),
   hmget: jest.fn(),
   lpush: jest.fn(),
   lrem: jest.fn(),
   lrange: jest.fn(),
};

describe('addToActive', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('adds new entry', async () => {
      mockRedis.hset.mockResolvedValue(1);
      mockRedis.lpush.mockResolvedValue(1);

      const addToActive = createAddToActive(mockRedis as unknown as Redis);
      const result = await addToActive(
         'mockGame',
         'mockPlayerA',
         'mockPlayerB',
         3
      );

      expect(result).toBe(true);
      expect(mockRedis.hset).toHaveBeenCalledWith(
         'cache:active:data',
         'mockGame',
         JSON.stringify({
            gameId: 'mockGame',
            playerA: 'mockPlayerA',
            playerB: 'mockPlayerB',
            observerCount: 3,
         })
      );
      expect(mockRedis.lpush).toHaveBeenCalledWith(
         'cache:active:keys',
         'mockGame'
      );
   });

   test('returns false if already set', async () => {
      mockRedis.hset.mockResolvedValue(0);
      mockRedis.lpush.mockResolvedValue(1);

      const addToActive = createAddToActive(mockRedis as unknown as Redis);
      const result = await addToActive(
         'mockGame',
         'mockPlayerA',
         'mockPlayerB',
         3
      );

      expect(result).toBe(false);
      expect(mockRedis.lpush).not.toHaveBeenCalled();
   });
});

describe('removeFromActive', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('removes entry', async () => {
      mockRedis.hdel.mockResolvedValue(1);
      mockRedis.lrem.mockResolvedValue(1);

      const removedFromActive = createRemoveFromActive(
         mockRedis as unknown as Redis
      );
      const result = await removedFromActive('mockGame');

      expect(result).toBe(true);
      expect(mockRedis.hdel).toHaveBeenCalledWith(
         'cache:active:data',
         'mockGame'
      );
      expect(mockRedis.lrem).toHaveBeenCalledWith(
         'cache:active:keys',
         0,
         'mockGame'
      );
   });

   test('returns false if does not exist', async () => {
      mockRedis.hdel.mockResolvedValue(0);
      mockRedis.lrem.mockResolvedValue(0);

      const removedFromActive = createRemoveFromActive(
         mockRedis as unknown as Redis
      );
      const result = await removedFromActive('mockGame');

      expect(result).toBe(false);
      expect(mockRedis.hdel).toHaveBeenCalled();
   });
});

describe('getActive', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('returns parsed entries', async () => {
      const mockPayload = [
         {
            gameId: 'mockGame1',
            playerA: 'mockPlayerA',
            playerB: 'mockPlayerB',
            observerCount: 3,
         },
         {
            gameId: 'mockGame2',
            playerA: 'mockPlayer1',
            playerB: 'mockPlayer2',
            observerCount: 0,
         },
      ];
      mockRedis.hmget.mockResolvedValue(
         mockPayload.map((item) => JSON.stringify(item))
      );
      mockRedis.lrange.mockResolvedValue(['mockGame1', 'mockGame2']);

      const getActive = createGetActive(mockRedis as unknown as Redis);
      const result = await getActive(10, 0);

      expect(result).toStrictEqual(mockPayload);
      expect(mockRedis.lrange).toHaveBeenCalledWith('cache:active:keys', 0, 9);
      expect(mockRedis.hmget).toHaveBeenCalledWith(
         'cache:active:data',
         'mockGame1',
         'mockGame2'
      );
   });

   test('paginates correctly', async () => {
      mockRedis.hmget.mockResolvedValue([]);
      mockRedis.lrange.mockResolvedValue([]);

      const getActive = createGetActive(mockRedis as unknown as Redis);

      await getActive(10, 1);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:active:keys',
         10,
         19
      );

      await getActive(5, 3);
      expect(mockRedis.lrange).toHaveBeenCalledWith(
         'cache:active:keys',
         15,
         19
      );
   });
});
