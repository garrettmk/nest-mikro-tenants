import { GraphQLActions } from '@nest-mikro-tenants/backend/actions';
import { TenantStatus, UserStatus } from '@nest-mikro-tenants/core/domain';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(TenantStatus, {
  name: 'TenantStatus',
});

GraphQLActions.applyActions();
