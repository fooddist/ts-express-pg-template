/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import jwt, { SignOptions } from 'jsonwebtoken';
import logger from '../logger';

export type JWTError = {
  name: string;
  message: string;
}

export const signToken = (
  payload: Record<string, string>,
  secret: string,
  options?: SignOptions,
): string => (
  jwt.sign(payload, secret, options)
);

export const decodeToken = (token: string): string | Record<string, string> | null | JWTError => {
  try {
    return jwt.decode(token);
  } catch (err) {
    logger.error(`JWT Error: ${err.message}`);
    return err;
  }
};

export const verifyToken = (
  token: string,
  secret: string,
): Promise<undefined | Record<string, string>> => (
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, data) => {
      if (err) reject(err);
      resolve(data as Record<string, string> | undefined);
    });
  })
);

export const isJWTError = (value: any): value is JWTError => 'name' in value && 'message' in value;
