import { ClassMetadataManager } from '@garrettmk/class-schema';
import { applyActions } from '@garrettmk/metadata-actions';
import { graphqlClassActions } from '@nest-mikro-tenants/backend/common';
import '@nest-mikro-tenants/core/domain';

ClassMetadataManager.entries()
    .filter(([, metadata]) => metadata.input || metadata.output)
    .forEach(([target, metadata]) => {
        console.log({ target })
        applyActions(metadata, { target }, graphqlClassActions);
    });