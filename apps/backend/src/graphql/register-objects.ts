import { ClassMetadataManager } from '@garrettmk/class-schema';
import { applyActions } from '@garrettmk/metadata-actions';
import { graphqlClassActions } from '@nest-mikro-tenants/backend/common';


ClassMetadataManager.entries()
    .filter(([, metadata]) => metadata.input || metadata.output)
    .forEach(([target, metadata]) => applyActions(metadata, { target }, graphqlClassActions));