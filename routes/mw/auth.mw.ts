import { Request, Response, NextFunction } from 'express';
import { decodeToken, isJWTError, verifyToken } from '../../lib/jwt';
import { ApiScope } from '../../lib/types';
import logger from '../../logger';
import { checkScope, getServiceBySpid } from '../../redis/store/services';
import {
  forbidden,
  notFound,
  printOperation,
  serverError,
} from '../handlers';

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const __authMiddleware = (
  requestedScope: ApiScope,
  checkFn: (requestedScope: ApiScope, serviceScope: ApiScope) => boolean,
): MiddlewareFunction => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const [token] = req.headers.authorization?.match(/\S+$/) || [];
  if (!token) return forbidden(res, 'No authorization token found.');

  const data = decodeToken(token);
  if (typeof data === 'string' || !data) return forbidden(res, 'Authorization token malformed.');
  if (isJWTError(data)) {
    if (data.name === 'JsonWebTokenError') return forbidden(res, 'Authorization token malformed.');
    if (data.name === 'TokenExpiredError') return forbidden(res, 'Authorization token expired.');
    return forbidden(res);
  }

  const { spid } = data;
  try {
    const service = await getServiceBySpid(spid);
    if (!service) return notFound(res, 'Service account wasn\'t found. Make sure service is registered.');
    if ('error' in service) throw new Error(service.error);
    if (!checkFn(requestedScope, service.scope)) return forbidden(res);

    try {
      const payload = await verifyToken(token, service.key);
      if (!payload) return forbidden(res);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') return forbidden(res, 'Authorization token malformed.');
      if (err.name === 'TokenExpiredError') return forbidden(res, 'Authorization token expired.');
      return forbidden(res);
    }

    res.locals.issuer = service;
    next();
  } catch (err) {
    logger.error(`${printOperation(req)}\nServices Authorization Error: ${err}`);
    return serverError(res);
  }
};

export const scopeOrHigher = (requestedScope: ApiScope): MiddlewareFunction => (
  __authMiddleware(requestedScope, checkScope)
);

export const scopeOnly = (requestedScope: ApiScope): MiddlewareFunction => (
  __authMiddleware(requestedScope, (r, s) => r === s)
);
