import IORedis from 'ioredis';

const containerName = "blockchain-fee-redis";

export default class Redis {

    private static client = new IORedis(6379, containerName);

    static getClient() {
        return Redis.client;
    }

}