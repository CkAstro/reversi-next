import { redisUrl } from '@/lib/config';
import Redis from 'ioredis';

let redis: Redis | null = null;
export const getRedisClient = (retries = 5, delay = 1000): Promise<Redis> => {
   if (redis !== null) return Promise.resolve(redis);

   return new Promise((resolve, reject) => {
      const client = new Redis(redisUrl);

      client.once('ready', () => {
         console.log('redis connected..');
         redis = client;
         resolve(redis);
      });

      client.once('error', (error: unknown) => {
         console.error('redis connection error:', error);
         if (retries < 1) return reject(error);

         setTimeout(() => {
            getRedisClient(retries - 1, delay)
               .then(resolve)
               .catch(reject);
         }, delay);
      });
   });
};
