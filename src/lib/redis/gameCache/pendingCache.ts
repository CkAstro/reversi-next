import type Redis from 'ioredis';
import type { Reversi } from '@/types/reversi';

const HASH_KEY = 'cache:pending:data';
const LIST_KEY = 'cache:pending:keys';

interface PendingEntry {
   gameId: Reversi['GameId'];
   player: Reversi['Username'];
}

export function createAddToPending(redis: Redis) {
   /** Add a game to pending cache
    * @param gameId id of the game
    * @param player waiting player
    * @returns true if added, false if already exists
    */
   return async function addToPending(
      gameId: Reversi['GameId'],
      player: Reversi['Username']
   ) {
      const payload = JSON.stringify({ gameId, player });

      try {
         const wasNew = await redis.hset(HASH_KEY, gameId, payload);
         if (wasNew === 0) return false;

         await redis.lpush(LIST_KEY, gameId);
         return true;
      } catch (error) {
         const message = error instanceof Error ? error.message : error;
         throw new Error(`failed to add pending game [${gameId}]: ${message}`);
      }
   };
}

export function createRemoveFromPending(redis: Redis) {
   /** remove a game from pending cache
    * @param gameId id of the game
    * @returns true if removed, false if did not exist
    */
   return async function removeFromPending(gameId: Reversi['GameId']) {
      try {
         const removedCount = await redis.lrem(LIST_KEY, 0, gameId);
         await redis.hdel(HASH_KEY, gameId);

         return removedCount > 0;
      } catch (error) {
         const message = error instanceof Error ? error.message : error;
         throw new Error(
            `failed to remove pending game [${gameId}]: ${message}`
         );
      }
   };
}

export function createGetPending(redis: Redis) {
   /** get paginated list of pending games from cache
    * @param count number of games to return
    * @param page page of games to return
    */
   return async function getPending(count = 10, page = 0) {
      const start = count * page;
      const end = count * (page + 1) - 1;

      const keys = await redis.lrange(LIST_KEY, start, end);
      if (keys.length === 0) return [];

      const values = await redis.hmget(HASH_KEY, ...keys);
      return values
         .filter((value) => value !== null)
         .map((value) => JSON.parse(value) as PendingEntry);
   };
}
