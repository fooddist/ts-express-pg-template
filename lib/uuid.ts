import { v4 } from 'uuid';

export const generateKey = (prefix = ''): string => (
  `${prefix}${v4().replace(/-/g, '')}`
);
