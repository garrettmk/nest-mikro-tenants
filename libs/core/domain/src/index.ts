import { BaseObjectActions, ValidationActions } from '@garrettmk/class-schema';
import { FactoryActions } from '@nest-mikro-tenants/core/factories';
import './lib/tenant.models';
import './lib/user.models';

FactoryActions.applyActions();
ValidationActions.applyActions();
BaseObjectActions.applyActions();

export * from './lib/tenant.models';
export * from './lib/user.models';