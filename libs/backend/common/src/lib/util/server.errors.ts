import { ErrorCode } from './constants.util';
import { ApolloError } from 'apollo-server-errors';

export class NotFoundError extends ApolloError {
  constructor(message = '', extensions: Record<string, unknown> = {}) {
    super(message, ErrorCode.NOT_FOUND, extensions);
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
