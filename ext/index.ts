import fetch from 'cross-fetch';
import { trimLeadingSlash, trimTrailingSlash } from '../lib/trimmers';
import logger from '../logger';
import { ext, ExternalServices, getToken } from './services';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface RequestOptions<B> {
  path: string;
  method?: Method;
  body?: B;
}

const __handleFetchResponse = <R>(res: Response): Promise<R> => {
  const contentType = res.headers.get('content-type');
  if (!contentType) return res.text() as unknown as Promise<R>;
  if (contentType.startsWith('text')) return res.text() as unknown as Promise<R>;
  if (contentType === 'application/json') return res.json();
  return res.blob() as unknown as Promise<R>;
};

export const request = <R = unknown, B = unknown>(
  service: ExternalServices,
  {
    path,
    method = Method.GET,
    body,
  }: RequestOptions<B>,
): Promise<R | void> => {
  const url = `${trimTrailingSlash(ext[service].baseUrl)}/${trimLeadingSlash(path)}`;
  const headers = new Headers({
    Authorization: `Bearer ${getToken(service)}`,
  });
  if (body && typeof body === 'object') headers.set('Content-Type', 'application/json');
  const init: RequestInit = {
    headers,
    method,
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return fetch(url, init)
    .then<R>((res) => __handleFetchResponse<R>(res))
    .catch((errorResponse) => {
      logger.error(`External Request Error. Path: ${url}`);
      if ('error' in errorResponse) {
        logger.error(
          typeof errorResponse.error === 'function'
            ? errorResponse.error()
            : JSON.stringify(errorResponse.error),
        );
      }
    });
};
