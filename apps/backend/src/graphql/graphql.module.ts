import { NotFoundError as DatabaseNotFoundError } from '@mikro-orm/core';
import { NotFoundError } from '../server.errors';
import { isNonErrorThrown } from './is-non-error-thrown.util';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { ValidationError } from 'class-validator';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import './register-objects';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError,
    }),
  ],
})
export class GraphQLModule {}

function formatError(error: GraphQLError): GraphQLFormattedError {
  const { originalError } = error;

  if (originalError instanceof ValidationError)
    return new UserInputError(originalError.message, {
      target: originalError.target,
      value: originalError.value,
      property: originalError.property,
      children: originalError.children,
      constraints: originalError.constraints,
    });

  // ValidationError doesn't actually extend Error, and class-validator typically
  // throws an Array of ValidationErrors. Because of this, validation problems
  // will usually result in "NonErrorThrown" error, with a "thrownValue" property
  // holding the original ValidationError/array.
  const nonError = isNonErrorThrown(originalError) 
    ? Array.isArray(originalError.thrownValue) 
      ? originalError.thrownValue[0]
      : originalError.thrownValue
    : undefined; 

  if (nonError instanceof ValidationError) {
    return new UserInputError(nonError.toString(), {
      target: nonError.target,
      value: nonError.value,
      property: nonError.property,
      children: nonError.children,
      constraints: nonError.constraints,
    });
  }

  if (originalError instanceof DatabaseNotFoundError)
    return new NotFoundError(originalError.message, {
      entity: originalError.entity,
      stacktrace: originalError.stack,
    });

  return error;
}
