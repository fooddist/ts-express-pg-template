import { isEmpty } from 'lodash';
import store from '.';
import { trimTrailingDash } from '../../lib/trimmers';
import { ApiScope } from '../../lib/types';

const storePrefix = trimTrailingDash(process.env.REDIS_STORE_PREFIX || 'store');
const servicePrefix = `${storePrefix}-svc`;

export interface ServiceAttributes {
  spid: string;
  label: string;
  key: string;
  scope: ApiScope;
}

export interface ServiceNode extends ServiceAttributes {
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isServiceNode = (node: any): node is ServiceNode => (
  'spid' in node && 'key' in node && 'scope' in node
);

type AuthErrorResponse = { error: string };

export const API_SCOPES = {
  [ApiScope.root]: 1,
  [ApiScope.admin]: 2,
  [ApiScope.service]: 3,
};

export const checkScope = (requestScope: ApiScope, serviceScope: ApiScope): boolean => {
  const requestPriority = API_SCOPES[requestScope] || 3;
  const servicePriority = API_SCOPES[serviceScope] || 99;
  return requestPriority >= servicePriority;
};

export const addService = async ({
  spid,
  label,
  key,
  scope,
}: ServiceAttributes): Promise<ServiceNode | null | AuthErrorResponse> => {
  const existing = await store.hgetall(`${servicePrefix}-${spid}`);
  if (!isEmpty(existing)) return null;

  try {
    const service = {
      spid,
      key,
      label,
      scope,
      created_at: new Date().toJSON(),
    };
    const response = await store.hmset(`${servicePrefix}-${spid}`, service);
    if (response !== 'OK') throw new Error(response);

    return service;
  } catch (err) {
    const error = `Store Error: ${err}`;
    return { error };
  }
};

export const getAllServices = async (
  scope = ApiScope.service,
): Promise<ServiceNode[] | AuthErrorResponse> => {
  try {
    const keys = await store.keys(`${servicePrefix}*`);
    const pipeline = store.pipeline();
    keys.forEach((key) => {
      pipeline.hgetall(key);
    });
    const services: ServiceNode[] = [];
    (await pipeline.exec())
      .forEach(([err, data]) => {
        if (err) return;
        if (!isServiceNode(data)) return;
        if (!checkScope(data.scope, scope)) return;
        services.push(data);
      });
    return services;
  } catch (err) {
    const error = `Store Error: ${err}`;
    return { error };
  }
};

export const getServiceBySpid = async (
  spid: string,
): Promise<ServiceNode | null | AuthErrorResponse> => {
  try {
    const service = await store.hgetall(`${servicePrefix}-${spid}`);
    return isServiceNode(service) ? service : null;
  } catch (err) {
    const error = `Store Error: ${err}`;
    return { error };
  }
};

export const updateService = async (
  service: ServiceNode,
): Promise<ServiceNode | AuthErrorResponse> => {
  try {
    const result = await store.hmset(`${servicePrefix}-${service.spid}`, service as {
      spid: string;
      key: string;
      label: string;
      scope: ApiScope;
      created_at: string;
    });
    if (result !== 'OK') throw new Error(result);
    return service;
  } catch (err) {
    const error = `Store Error: ${err}`;
    return { error };
  }
};

export const revokeService = async (
  service: ServiceNode,
): Promise<ServiceNode | AuthErrorResponse> => {
  try {
    const result = await store.del(`${servicePrefix}-${service.spid}`);
    if (result < 1) throw new Error(`Could not delete service with spid: ${service.spid}`);
    return service;
  } catch (err) {
    const error = `Store Error: ${err}`;
    return { error };
  }
};

export const __checkRootUser = async (): Promise<boolean | AuthErrorResponse> => {
  const result = await getAllServices(ApiScope.root);
  if ('error' in result) return result;
  return !!result.length;
};
