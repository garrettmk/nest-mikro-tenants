import { Options } from '@mikro-orm/core';
import { EntitySchemaRegistry } from '@nest-mikro-tenants/backend/common';
import 'dotenv/config';
import './apps/backend/src/database/register-entities';

const {
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD
} = process.env;


export const mikroOrmConfig: Options = {
  entities: EntitySchemaRegistry.getEntitySchemas(),
  type: 'postgresql',
  clientUrl: DATABASE_URL,
  dbName: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
};

export default mikroOrmConfig;