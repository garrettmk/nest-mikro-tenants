import { Id } from '@garrettmk/class-schema';
import { ValidationActions } from '@nest-mikro-tenants/core/actions';
import { FactoryActions } from '@nest-mikro-tenants/core/factories';
import cuid, { isCuid } from 'cuid';

Id.isId = function(value: unknown): value is Id {
    return typeof value === 'string' && isCuid(value);
}

Id.fake = function() {
    return cuid();
}

import './lib/tenant.models';
import './lib/user.models';

FactoryActions.applyActions();
ValidationActions.applyActions();

export * from './lib/tenant.models';
export * from './lib/user.models';

