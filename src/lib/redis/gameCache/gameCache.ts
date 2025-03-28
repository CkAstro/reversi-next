import { getRedisClient } from '@/lib/redis/redis';
import { logger } from '@/lib/utils/logger';
import {
   createAddToPending,
   createGetPending,
   createRemoveFromPending,
} from './pendingCache';
import {
   createAddToActive,
   createGetActive,
   createRemoveFromActive,
} from './activeCache';
import {
   createAddToComplete,
   createGetComplete,
   createRemoveFromComplete,
} from './completeCache';
import type Redis from 'ioredis';

interface GameCache {
   getActive: ReturnType<typeof createGetActive>;
   getPending: ReturnType<typeof createGetPending>;
   getComplete: ReturnType<typeof createGetComplete>;
   addToActive: ReturnType<typeof createAddToActive>;
   addToPending: ReturnType<typeof createAddToPending>;
   addToComplete: ReturnType<typeof createAddToComplete>;
   removeFromActive: ReturnType<typeof createRemoveFromActive>;
   removeFromPending: ReturnType<typeof createRemoveFromPending>;
   removeFromComplete: ReturnType<typeof createRemoveFromComplete>;
}

const cacheSingleton = {
   instance: null as GameCache | null,
   initPromise: null as Promise<Redis> | null,
};

export const getGameCache = async () => {
   if (cacheSingleton.instance !== null) return cacheSingleton.instance;

   if (cacheSingleton.initPromise === null)
      cacheSingleton.initPromise = getRedisClient();

   try {
      const redis = await cacheSingleton.initPromise;
      cacheSingleton.instance = {
         getActive: createGetActive(redis),
         getPending: createGetPending(redis),
         getComplete: createGetComplete(redis),
         addToActive: createAddToActive(redis),
         addToPending: createAddToPending(redis),
         addToComplete: createAddToComplete(redis),
         removeFromActive: createRemoveFromActive(redis),
         removeFromPending: createRemoveFromPending(redis),
         removeFromComplete: createRemoveFromComplete(redis),
      };

      return cacheSingleton.instance;
   } catch (error) {
      logger('unable to initialize redis', error);
      throw new Error(error as string);
   }
};
