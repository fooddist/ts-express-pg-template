import { API_SCOPES } from '../redis/store/services';

type LengthValidator = {
  is?: number;
  maximum?: number;
  minimum?: number;
}

type FormatValidator = {
  pattern?: RegExp | string;
  flags?: string;
  message?: string;
}

type InclusionValidator = {
  within: string[];
  message?: string;
}

export type ValidatorOptions = {
  optional: boolean;
  length?: number;
}

export interface Validator {
  email?: boolean;
  format?: FormatValidator;
  inclusion?: InclusionValidator;
  length?: LengthValidator;
  presence?: boolean;
  type?: 'array' | 'integer' | 'number' | 'string' | 'date' | 'boolean';
}

const validators: Record<string, (opts?: ValidatorOptions | undefined) => Validator> = {
  id: (opts?: ValidatorOptions) => ({
    format: {
      pattern: /^[^/?#\s]+$/,
      message: 'cannot contain whitespaces or characters: ?, /, #.',
    },
    presence: !opts?.optional,
    type: 'string',
  }),
  name: (opts?: ValidatorOptions) => ({
    length: {
      minimum: 2,
      maximum: opts?.length || 100,
    },
    presence: !opts?.optional,
    type: 'string',
  }),
  email: (opts?: ValidatorOptions) => ({
    email: true,
    presence: !opts?.optional,
  }),
  scope: (opts?: ValidatorOptions) => ({
    inclusion: {
      within: Object.keys(API_SCOPES),
      message: '%{value} is not a valid scope',
    },
    presence: !opts?.optional,
  }),
};

export default validators;
