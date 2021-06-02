import db from './db';
import { HealthStatus } from '../lib/types';
import logger from '../logger';

const dbHealthCheck = async (): Promise<HealthStatus> => {
  try {
    await db.authenticate();
    return 'OK';
  } catch (err) {
    logger.error(`DB Connection Error: ${err}`);
    return 'ERROR';
  }
};

export default dbHealthCheck;
