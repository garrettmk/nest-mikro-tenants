import { ClassMetadataManager } from '@garrettmk/class-schema';
import { applyActions } from '@garrettmk/metadata-actions';
import { entityClassActions } from '@nest-mikro-tenants/backend/common';
import '@nest-mikro-tenants/core/domain';

ClassMetadataManager.entries()
    .filter(([, metadata]) => metadata.entity)
    .forEach(([target, metadata]) => applyActions(metadata, { target }, entityClassActions));