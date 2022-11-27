import 'dotenv/config';
import './apps/backend/src/database/register-entities';
import { Options } from '@mikro-orm/core';
import { ClassMetadataManager } from '@garrettmk/class-schema';

const entities = ClassMetadataManager.entries()
  .filter(([, metadata]) => metadata.entity)
  .map(([target]) => target);

const {
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD
} = process.env;

export const mikroOrmConfig: Options = {
  entities: entities,
  type: 'postgresql',
  clientUrl: DATABASE_URL,
  dbName: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  seeder: {
    path: './dist/libs/backend/backend-objects',
    pathTs: './libs/backend/backend-objects',
    glob: '**/*.seeder.ts'
  }
};

export default mikroOrmConfig;