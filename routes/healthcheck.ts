import { Server } from 'http';
import { createTerminus } from '@godaddy/terminus';
import { HealthStatus } from '../lib/types';
import logger from '../logger';
import { redisStoreHealthCheck } from '../redis/store/check';
import { redisCacheHealthCheck } from '../redis/cache/check';
import dbHealthCheck from '../db/check';

interface HealthCheckResponse {
  server: HealthStatus;
  store: HealthStatus;
  cache: HealthStatus;
}

const healthcheck = (server: Server): void => {
  const onHealthCheck = async (): Promise<HealthCheckResponse> => {
    const checks = {
      server: server.address() !== null ? 'OK' : 'ERROR' as HealthStatus,
      store: await redisStoreHealthCheck(),
      cache: await redisCacheHealthCheck(),
      db: await dbHealthCheck(),
    };
    return checks;
  };

  createTerminus(server, {
    logger: logger.info,
    healthChecks: {
      '/healthcheck': onHealthCheck,
    },
  });
};

export default healthcheck;
