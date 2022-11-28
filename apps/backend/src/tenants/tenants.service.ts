import { EntityRepository } from '@mikro-orm/postgresql';
import { CrudService } from '@nest-mikro-tenants/backend/factories';
import { Tenant, TenantCreateInput, TenantsWhereInput, TenantsWhereOneInput, TenantUpdateInput } from '@nest-mikro-tenants/core/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsService extends CrudService(Tenant, TenantCreateInput, TenantUpdateInput, TenantsWhereInput, TenantsWhereOneInput) {
    constructor(
        private readonly repo: EntityRepository<Tenant>,
    ) {
        super(repo);
    }
}
