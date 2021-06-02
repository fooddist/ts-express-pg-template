import { Sequelize } from 'sequelize/types';
import logger from '../logger';
import associate from './models/associations';
import db from './db';

const bootDb = async (): Promise<Sequelize> => {
  associate();
  await db.sync();
  logger.info('Successfully synced database');
  return db;
};

export default bootDb;
