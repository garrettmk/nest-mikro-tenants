import { ClassMetadataManager } from '@garrettmk/class-schema';
import { applyActions } from '@garrettmk/metadata-actions';
import { DatabaseSchema, entityClassActions } from '@nest-mikro-tenants/backend/common';
import { User, Tenant } from '@nest-mikro-tenants/core/domain';

ClassMetadataManager.updateMetadata(User, meta => ({ ...meta, schema: DatabaseSchema.USERS_AND_TENANTS }));
ClassMetadataManager.updateMetadata(Tenant, meta => ({ ...meta, schema: DatabaseSchema.USERS_AND_TENANTS }));


ClassMetadataManager.entries()
    .filter(([, metadata]) => metadata.entity)
    .forEach(([target, metadata]) => applyActions(metadata, { target }, entityClassActions));