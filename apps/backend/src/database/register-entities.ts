import { ClassMetadataManager } from '@garrettmk/class-schema';
import { applyActions } from '@garrettmk/metadata-actions';
import { DatabaseSchema, entityClassActions } from '@nest-mikro-tenants/backend/common';
import { User } from '@nest-mikro-tenants/core/domain';

ClassMetadataManager.mergeMetadata(User, { schema: DatabaseSchema.USERS_AND_TENANTS });


ClassMetadataManager.entries()
    .filter(([, metadata]) => metadata.entity)
    .forEach(([target, metadata]) => applyActions(metadata, { target }, entityClassActions));