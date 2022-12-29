import { ApolloError } from 'apollo-server-errors';

export enum ErrorCode {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  NOT_FOUND = 'NOT_FOUND',
}

export class NotFoundError extends ApolloError {
  constructor(message = '', extensions: Record<string, unknown> = {}) {
    super(message, ErrorCode.NOT_FOUND, extensions);
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
