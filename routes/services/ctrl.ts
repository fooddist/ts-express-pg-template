import { Request, Response } from 'express';
import { pick } from 'lodash';
import { validate } from 'validate.js';
import { ApiScope } from '../../lib/types';
import { generateKey } from '../../lib/uuid';
import validators from '../../lib/validators';
import logger from '../../logger';
import {
  addService,
  checkScope,
  getAllServices,
  getServiceBySpid,
  revokeService,
  updateService,
} from '../../redis/store/services';
import {
  badRequest,
  conflict,
  forbidden,
  notFound,
  printOperation,
  serverError,
} from '../handlers';

export const getServicesCtrl = async (req: Request, res: Response): Promise<void> => {
  const { issuer } = res.locals;
  if (!issuer) return forbidden(res);

  const scope = req.query.scope?.toString().toLowerCase() as ApiScope || issuer.scope;
  const validationResult = validate({ scope }, { scope: validators.scope() });
  if (validationResult) return badRequest(res, validationResult);
  if (!checkScope(scope, issuer.scope)) return forbidden(res, `Cannot query ${scope} scope. Remove scope query or use ${issuer.scope} scope or below.`);

  try {
    const services = await getAllServices(scope);
    if ('error' in services) throw new Error(services.error);

    res.status(200).json({ status: 200, count: services.length, result: services });
  } catch (err) {
    logger.error(`${printOperation(req)}\nServices Controller Error: ${err}`);
    return serverError(res);
  }
};

export const postServiceCtrl = async (req: Request, res: Response): Promise<void> => {
  const { issuer } = res.locals;
  if (!issuer) return forbidden(res);

  const constraints = {
    spid: validators.id(),
    scope: validators.scope({ optional: true }),
    label: validators.name({ optional: true }),
  };
  const validationResult = validate(req.body, constraints);
  if (validationResult) return badRequest(res, validationResult);

  const { spid, scope = ApiScope.service, label = spid } = req.body;
  if (!spid) return badRequest(res, 'Required param spid hasn\'t been provided');
  if (!checkScope(scope, issuer.scope)) return forbidden(res, `Cannot register service with ${scope} scope.`);

  const key = generateKey();

  try {
    const service = await addService({
      spid,
      key,
      label,
      scope,
    });
    if (!service) return conflict(res, 'Service with provided SPID already registered.');
    if ('error' in service) throw new Error(service.error);

    res.status(201).json(service);
  } catch (err) {
    logger.error(`${printOperation(req)}\nServices Controller Error: ${err}`);
    return serverError(res);
  }
};

export const getServiceBySpidCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { issuer } = res.locals;
  if (!issuer) return forbidden(res);

  const { spid } = req.params;
  if (!spid) return badRequest(res, 'Required param spid hasn\'t been provided');
  const validationResult = validate({ spid }, { spid: validators.id() });
  if (validationResult) return badRequest(res, validationResult);

  try {
    const service = await getServiceBySpid(spid);
    if (!service) return notFound(res);
    if ('error' in service) throw new Error(service.error);
    if (!checkScope(service.scope, issuer.scope)) return forbidden(res);

    res.status(200).json(service);
  } catch (err) {
    logger.error(`${printOperation(req)}\nServices Controller Error: ${err}`);
    return serverError(res);
  }
};

export const putServiceBySpidCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { issuer } = res.locals;
  if (!issuer) return forbidden(res);

  const { spid } = req.params;
  if (!spid) return badRequest(res, 'Required param spid hasn\'t been provided');
  const paramValidationResult = validate({ spid }, { spid: validators.id() });
  if (paramValidationResult) return badRequest(res, paramValidationResult);

  const constraints = {
    scope: validators.scope({ optional: true }),
    label: validators.name({ optional: true }),
  };
  const bodyValidationResult = validate(req.body, constraints);
  if (bodyValidationResult) return badRequest(res, bodyValidationResult);

  try {
    const service = await getServiceBySpid(spid);
    if (!service) return notFound(res);
    if ('error' in service) throw new Error(service.error);
    if (!checkScope(service.scope, issuer.scope)) return forbidden(res);

    const updatedService = { ...service, ...pick(req.body, ['label', 'scope']) };
    const result = await updateService(updatedService);
    if ('error' in result) throw new Error(result.error);
    res.status(200).json(result);
  } catch (err) {
    logger.error(`${printOperation(req)}\nServices Controller Error: ${err}`);
    return serverError(res);
  }
};

export const deleteServiceBySpidCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { issuer } = res.locals;
  if (!issuer) return forbidden(res);

  const { spid } = req.params;
  if (!spid) return badRequest(res, 'Required param spid hasn\'t been provided');
  const paramValidationResult = validate({ spid }, { spid: validators.id() });
  if (paramValidationResult) return badRequest(res, paramValidationResult);

  try {
    const service = await getServiceBySpid(spid);
    if (!service) return notFound(res);
    if ('error' in service) throw new Error(service.error);
    if (!checkScope(service.scope, issuer.scope)) return forbidden(res);

    const result = await revokeService(service);
    if ('error' in result) throw new Error(result.error);
    res.status(200).json({ message: `Access for service ${result.spid} was revoked.` });
  } catch (err) {
    logger.error(`${printOperation(req)}\nServices Controller Error: ${err}`);
    return serverError(res);
  }
};
