import type Redis from 'ioredis';
import type { Reversi } from '@/types/reversi';

const HASH_KEY = 'cache:complete:data';
const LIST_KEY = 'cache:complete:keys';

interface CompleteEntry {
   gameId: Reversi['GameId'];
   playerA: Reversi['Username'];
   playerB: Reversi['Username'];
   score: [number, number];
}

export function createAddToComplete(redis: Redis) {
   /** Add a game to active cache
    * @param gameId id of the game
    * @param playerA first player
    * @param playerB second player
    * @param score final score formatted [playerA, playerB]
    * @returns true if added, false if already exists
    */
   return async function addToComplete(
      gameId: Reversi['GameId'],
      playerA: Reversi['Username'],
      playerB: Reversi['Username'],
      score: [number, number]
   ) {
      const payload = JSON.stringify({
         gameId,
         playerA,
         playerB,
         score,
      });

      try {
         const wasNew = await redis.hset(HASH_KEY, gameId, payload);
         if (wasNew === 0) return false;

         await redis.lpush(LIST_KEY, gameId);
         return true;
      } catch (error) {
         const message = error instanceof Error ? error.message : error;
         throw new Error(`failed to add complete game [${gameId}]: ${message}`);
      }
   };
}

export function createRemoveFromComplete(redis: Redis) {
   /** remove a game from complete cache
    * @param gameId id of the game
    * @returns true if removed, false if did not exist
    */
   return async function removeFromComplete(gameId: Reversi['GameId']) {
      try {
         const removedCount = await redis.lrem(LIST_KEY, 0, gameId);
         await redis.hdel(HASH_KEY, gameId);

         return removedCount > 0;
      } catch (error) {
         const message = error instanceof Error ? error.message : error;
         throw new Error(
            `failed to remove complete game [${gameId}]: ${message}`
         );
      }
   };
}

export function createGetComplete(redis: Redis) {
   /** get paginated list of complete games from cache
    * @param count number of games to return
    * @param page page of games to return
    */
   return async function getComplete(count = 10, page = 0) {
      const start = count * page;
      const end = count * (page + 1) - 1;

      const keys = await redis.lrange(LIST_KEY, start, end);
      if (keys.length === 0) return [];

      const values = await redis.hmget(HASH_KEY, ...keys);
      return values
         .filter((value) => value !== null)
         .map((value) => JSON.parse(value) as CompleteEntry);
   };
}
