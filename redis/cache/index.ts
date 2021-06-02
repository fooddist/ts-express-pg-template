import Redis from 'ioredis';

const connectionUrl = process.env.REDIS_CACHE_CONNECTION_URL || 'redis://localhost:6380/0';

const cache = new Redis(connectionUrl);

export default cache;
