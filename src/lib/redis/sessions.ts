import { getRedisClient } from '@/lib/redis/redis';
import { getRandomId } from '@/lib/utils/getRandomId';
import type Redis from 'ioredis';

/** hash username/auth key for verification */
const logUsername = (redis: Redis, username: string, authKey: string) =>
   redis.hset('usernames', username, authKey);

/** verify username is either free or associated with auth key
 * @param username username to verify
 * @param authKey unique client identifier
 */
export const verifyUsername = (username: string, authKey: string) =>
   getRedisClient().then(async (redis) => {
      const associatedKey = await redis.hget('usernames', username);
      return associatedKey === null || associatedKey === authKey;
   });

/** combine authKey and username into a session key
 * @returns authKey:username
 */
const buildSessionKey = (authKey: string, username: string | undefined) =>
   [authKey, username].join(':');

/** retrieve sessionId from redis
 * @param redis the redis client
 * @param authKey unique client identifier
 * @param username client-provided username
 */
const getSessionId = async (
   redis: Redis,
   authKey: string,
   username: string
): Promise<string> => {
   const sessionKey = buildSessionKey(authKey, username);
   const sessionValue = await redis.get(sessionKey);
   if (sessionValue !== null) return sessionValue;

   // check for existing entry with no username
   const blankKey = buildSessionKey(authKey, undefined);
   const blankValue = await redis.get(blankKey);

   // delete old entry if we're upgrading
   if (blankKey !== sessionKey) await redis.del(blankKey);

   const sessionId = blankValue ?? getRandomId();
   await redis.set(sessionKey, sessionId);
   await logUsername(redis, username, authKey);
   return sessionId;
};

/** get sessionId if auth:user combo exists, otherwise create one
 * @param authKey unique client identifier
 * @param username client-provided username
 *
 * note username will be blank at first - creating one
 * and calling getSession again will upgrade, while
 * calling a 3rd time with a different username will
 * create a second entry.
 *
 * @example getSession('uniqueKey', '') => {'uniqueKey:': 'pId-1'}
 * @example getSession('uniqueKey', 'user1') => {'uniqueKey:user1': 'pId-1'}
 * @example getSession('uniqueKey', 'user2') => {
 *    'uniqueKey:user1', 'pId-1',
 *    'uniqueKey:user2', 'pId-2',
 * }
 */
export const getSession = (authKey: string, username = '') =>
   getRedisClient().then((redis) => getSessionId(redis, authKey, username));
