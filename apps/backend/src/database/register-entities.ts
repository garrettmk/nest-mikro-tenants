import { ClassMetadataManager } from '@garrettmk/class-schema';
import { DatabaseSchema, EntityActions } from '@nest-mikro-tenants/backend/common';
import { User, Tenant } from '@nest-mikro-tenants/core/domain';

ClassMetadataManager.updateMetadata(User, meta => ({ ...meta, schema: DatabaseSchema.USERS_AND_TENANTS }));
ClassMetadataManager.updateMetadata(Tenant, meta => ({ ...meta, schema: DatabaseSchema.USERS_AND_TENANTS }));

EntityActions.applyActions();