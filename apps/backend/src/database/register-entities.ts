import { ClassMetadataManager } from '@garrettmk/class-schema';
import { EntityActions } from '@nest-mikro-tenants/backend/actions';
import { User, Tenant } from '@nest-mikro-tenants/core/domain';

export enum DatabaseSchema {
  USERS_AND_TENANTS = 'USERS_AND_TENANTS',
}

ClassMetadataManager.updateMetadata(User, (meta) => ({
  ...meta,
  schema: DatabaseSchema.USERS_AND_TENANTS,
}));

ClassMetadataManager.updateMetadata(Tenant, (meta) => ({
  ...meta,
  schema: DatabaseSchema.USERS_AND_TENANTS,
}));

EntityActions.applyActions();
