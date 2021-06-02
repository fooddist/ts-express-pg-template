import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((opts) => `[${opts.moduleName}] ${opts.level}: ${opts.message}`),
      ),
    }),
  ],
});

export default logger.child({ moduleName: process.env.SERVICE_NICKNAME || 'server' });
