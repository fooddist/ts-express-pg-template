export enum DatabaseErrorMessage {
  DB_CONN = 'DB_CONN',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  EXPIRED = 'EXPIRED',
}

export interface DatabaseErrorResponse {
  error: DatabaseErrorMessage;
}
