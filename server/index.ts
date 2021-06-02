import http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '../logger';
import routes from '../routes';
import { version } from '../package.json';
import cors from './cors';
import limiter from './limiter';

const [MAJOR_VERSION] = version.match(/^\d+/) || ['1'];
const routerPrefix = `/api/v${MAJOR_VERSION}`;

const nickname = process.env.SERVICE_NICKNAME || 'service';

const bootServer = (PORT: number): http.Server => {
  const service = express();

  service.use(cors());
  service.use(express.json());
  service.use(helmet());
  service.use(limiter);
  service.use(morgan(`[${nickname}] :method :url :status :res[content-length] - :response-time ms`));

  Object.entries(routes).forEach(([endpoint, router]) => {
    service.use(`${routerPrefix}/${endpoint}`, router);
  });

  const server = http.createServer(service);

  server.listen(PORT, () => {
    const { address, port } = server.address() as AddressInfo;
    logger.info(`Server is up and running at ${address}:${port}`);
    logger.info(`PID ${process.pid}`);
  });

  return server;
};

export default bootServer;
