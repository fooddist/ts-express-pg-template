import { Response } from 'express';

export type StatusCode = 400 | 401 | 403 | 404 | 409 | 500;

export enum ApiErrorMessage {
  BAD_REQUEST = 'BAD_REQUEST',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NOT_ALLOWED = 'NOT_ALLOWED',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
}

export type ApiErrorResponse = {
  error: ApiErrorMessage;
  details?: string;
  status: StatusCode;
}

const apiErrors: Record<StatusCode, ApiErrorMessage> = {
  400: ApiErrorMessage.BAD_REQUEST,
  401: ApiErrorMessage.INVALID_CREDENTIALS,
  403: ApiErrorMessage.NOT_ALLOWED,
  404: ApiErrorMessage.NOT_FOUND,
  409: ApiErrorMessage.CONFLICT,
  500: ApiErrorMessage.SERVER_ERROR,
};

const __apiErrorHandler = (
  res: Response<ApiErrorResponse>,
  code: StatusCode,
  details?: string,
): void => {
  const message: ApiErrorResponse = {
    error: apiErrors[code],
    status: code,
  };
  if (details) message.details = details;
  res.status(code).json(message);
};

export const badRequest = (
  res: Response<ApiErrorResponse>,
  details?: string,
): void => __apiErrorHandler(res, 400, details);

export const invalidCredentials = (
  res: Response<ApiErrorResponse>,
  details?: string,
): void => __apiErrorHandler(res, 401, details);

export const forbidden = (
  res: Response<ApiErrorResponse>,
  details?: string,
): void => __apiErrorHandler(res, 403, details);

export const notFound = (
  res: Response<ApiErrorResponse>,
  details?: string,
): void => __apiErrorHandler(res, 404, details);

export const conflict = (
  res: Response<ApiErrorResponse>,
  details?: string,
): void => __apiErrorHandler(res, 409, details);

export const serverError = (
  res: Response<ApiErrorResponse>,
  details?: string,
): void => __apiErrorHandler(res, 500, details);

export const printOperation = (req: Pick<Request, 'method' | 'url'>): string => `${req.method} ${req.url}`;
