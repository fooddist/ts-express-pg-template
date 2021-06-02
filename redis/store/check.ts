import store from '.';
import { HealthStatus } from '../../lib/types';

export const redisStoreHealthCheck = async (): Promise<HealthStatus> => {
  const response = await store.ping();
  return /pong/i.test(response) ? 'OK' : 'ERROR';
};
