import { Sequelize } from 'sequelize';

const connectionString = String(process.env.DB_CONNECTION_STRING);
const logging = /(yes|true)/i.test(process.env.DB_DEBUG_LOGGING || '');

const db = new Sequelize(connectionString, { logging });

export default db;
