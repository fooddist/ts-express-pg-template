import Redis from 'ioredis';

const connectionUrl = process.env.REDIS_STORE_CONNECTION_URL || 'redis://localhost:6379/0';

const store = new Redis(connectionUrl);

export default store;
