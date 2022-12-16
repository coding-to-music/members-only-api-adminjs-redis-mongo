import { createClient, RedisClientType } from "redis";
import { ENV } from "@utils/loadEnv";
import { logger } from "@utils/logger";

const redisClient: RedisClientType = createClient({
    url: ENV.REDIS_HOST,
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASSWORD
});

export const connectRedis = async () => {

    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));

    await redisClient.connect()

};

export const getCacheKey = async (key: string) => {
    return await redisClient.get(key);
};

export const setCacheKey = async (key: string, data: any): Promise<void> => {
    await redisClient.set(key, JSON.stringify(data), { EX: 300, NX: true });
};
