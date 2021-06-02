import { ApiScope } from '../../lib/types';
import { scopeOnly, scopeOrHigher } from './auth.mw';

export const rootOnly = scopeOnly(ApiScope.root);

export const rootOrHigher = scopeOrHigher(ApiScope.root);

export const adminOnly = scopeOnly(ApiScope.admin);

export const adminOrHigher = scopeOrHigher(ApiScope.admin);

export const serviceOnly = scopeOnly(ApiScope.service);
