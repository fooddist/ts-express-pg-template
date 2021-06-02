import cors, { CorsOptions, CorsRequest } from 'cors';
import logger from '../logger';

const DEFAULT_ALLOWED_METHODS = ['GET', 'PUT', 'POST', 'DELETE'];
const DEFAULT_ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

const origin = process.env.ORIGIN?.split(/\s*,\s*/) || true;
const methods = process.env.ALLOWED_METHODS?.split(/\s*,\s*/) || DEFAULT_ALLOWED_METHODS;
const allowedHeaders = process.env.ALLOWED_HEADERS?.split(/\s*,\s*/) || DEFAULT_ALLOWED_HEADERS;
const credentials = /true/i.test(process.env.USE_CREDENTIALS || '');
const debugLog = /true/i.test(process.env.CORS_DEBUG_LOG || '');

type CorsMiddleware = (
  req: CorsRequest,
  res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): unknown;
    end(): unknown;
  },
  next: (err?: unknown) => unknown
) => void;

const corsOptions: CorsOptions = {
  origin,
  methods,
  allowedHeaders,
  credentials,
};

const __printDebugLog = (): string => `CORS configuration:
   Accepted Origin: ${origin === true ? '*' : origin.join(', ')}
   Allowed Methods: ${methods.join(', ')}
   Allowed Headers: ${allowedHeaders.join(', ')}
   Use credentials: ${credentials}
`;

const corsMiddleware = (): CorsMiddleware => {
  logger.info('CORS has been enabled');
  if (debugLog) logger.info(__printDebugLog());
  return cors(corsOptions);
};

export default corsMiddleware;
