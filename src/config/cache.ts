import { createClient, RedisClientType } from 'redis';
import { ENV } from '@utils/validateEnv';

let redisClient: RedisClientType;

(async () => {

    redisClient = createClient({
        url: ENV.REDIS_HOST,
        username: ENV.REDIS_USERNAME,
        password: ENV.REDIS_PASSWORD
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect()

})();

export const getCacheKey = async (key: string) => {
    return await redisClient.get(key);
};

export const setCacheKey = async (key: string, data: any): Promise<void> => {
    await redisClient.set(key, JSON.stringify(data), { EX: 300, NX: true });
};
