import mongoose, { type MongooseError } from 'mongoose';
import { mongoUri } from '@/lib/config';
import { logger } from '@/lib/utils/logger';

const mongo = {
   promise: null as Promise<typeof mongoose> | null,
   connection: null as typeof mongoose | null,
};

export const connectToDatabase = async () => {
   if (mongo.connection !== null) return mongo.connection;

   if (mongo.promise === null) {
      logger('connecting to mongodb:', mongoUri);
      mongo.promise = mongoose.connect(mongoUri, {
         bufferCommands: false,
      });
   }

   try {
      mongo.connection = await mongo.promise;
      return mongo.connection;
   } catch (error) {
      logger('error connecting to database:', (error as MongooseError).message);
   }
};
