import { CrudResolvers } from "@nest-mikro-tenants/backend/factories";
import { PaginatedTenants, Tenant, TenantCreateInput, TenantsWhereInput, TenantsWhereOneInput, TenantUpdateInput } from "@nest-mikro-tenants/core/domain";
import { Resolver } from "@nestjs/graphql";
import { TenantsService } from "./tenants.service";

@Resolver()
export class TenantsResolver extends CrudResolvers(
    Tenant,
    TenantCreateInput,
    TenantUpdateInput,
    TenantsWhereInput,
    TenantsWhereOneInput,
    PaginatedTenants
) {
    constructor(service: TenantsService) {
        super(service);
    }
}