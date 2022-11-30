import { DeferredActionsRegistry } from '@nest-mikro-tenants/core/factories';
import './lib/tenant.models';
import './lib/user.models';

DeferredActionsRegistry.runDeferredActions();

export * from './lib/tenant.models';
export * from './lib/user.models';