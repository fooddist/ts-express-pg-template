import { signToken } from '../lib/jwt';

const tokenTtlSec = Number(process.env.EXT_TOKEN_TTL_SEC);
const nickname = String(process.env.SERVICE_NICKNAME);

export enum ExternalServices {
  external_spid = 'external_spid',
}

export interface ExternalService {
  baseUrl: string;
  key: string;
}

type Ext = Record<ExternalServices, ExternalService>;

export const ext: Ext = {
  [ExternalServices.external_spid]: {
    baseUrl: String(process.env.EXTERNAL_SPID_BASEURL),
    key: String(process.env.EXTERNAL_SPID_KEY),
  },
};

const __tokens = new Map<string, { token: string; exp: number; }>();

export const getToken = (service: ExternalServices): string => (
  (__tokens.has(service) && (__tokens.get(service)?.exp || 0) > Date.now())
    ? String(__tokens.get(service)?.token)
    : signToken({ spid: nickname }, ext[service].key, { expiresIn: tokenTtlSec })
);
