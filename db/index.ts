import { Sequelize } from 'sequelize/types';
import logger from '../logger';
import associate from './models/associations';
import db from './db';

const force = /(yes|true)/i.test(process.env.DB_FORCE_SYNC || '');

const bootDb = async (): Promise<Sequelize> => {
  associate();
  if (force) logger.warn('Force syncing database!');
  await db.sync({ force });
  logger.info('Successfully synced database');
  return db;
};

export default bootDb;
