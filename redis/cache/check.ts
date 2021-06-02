import cache from '.';
import { HealthStatus } from '../../lib/types';

export const redisCacheHealthCheck = async (): Promise<HealthStatus> => {
  const response = await cache.ping();
  return /pong/i.test(response) ? 'OK' : 'ERROR';
};
