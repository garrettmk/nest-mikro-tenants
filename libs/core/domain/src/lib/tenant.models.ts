import { abstract, BaseModel, Class, entity, input, output, Property, unique, manyToMany } from "@garrettmk/class-schema";
import { CreateInput, FiltersType, ObjectFilter, Paginated, Pick, UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { User } from "./user.models";

export enum TenantStatus {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED'
}

@Class({ output, entity, description: 'An application tenant'})
export class Tenant extends BaseModel {
    @Property(() => String, { unique, minLength: 2, description: 'The tenant\'s complete name' })
    name!: string;

    @Property(() => String, { unique, minLength: 2, description: 'A simplified, kebab-case version on the tenant\'s name' })
    slug!: string;

    @Property(() => TenantStatus, { default: () => TenantStatus.ENABLED, description: 'The tenant status' })
    status!: TenantStatus;

    @Property(() => Date, { default: () => new Date(), description: 'The datetime the model was created' })
    createdAt!: Date;

    @Property(() => Date, { default: () => new Date(), description: 'The datetime the model was last updated' })
    updatedAt!: Date;

    // Relations
    @Property(() => [User], { manyToMany, description: 'User\'s belonging to this tenant' })
    users?: User[];
}

@Class({ input })
export class TenantCreateInput extends CreateInput(Tenant, {
    required: ['name', 'slug'],
    omitted: ['createdAt', 'updatedAt'],
    abstract
}) {}

@Class({ input })
export class TenantUpdateInput extends UpdateInput(Tenant, {
    omitted: ['createdAt', 'updatedAt'],
    abstract
}) {}

@FiltersType(Tenant)
@Class({ input })
export class TenantFilterInput extends ObjectFilter(Tenant) {}

@Class({ input })
export class TenantFilterOneInput extends Pick(TenantFilterInput, ['id', 'name', 'slug']) {}

@Class({ input })
export class TenantsWhereInput extends WhereInput(Tenant, TenantFilterInput) {}

@Class({ input })
export class TenantsWhereOneInput extends WhereOneInput(Tenant, TenantFilterOneInput) {}

@Class({ output })
export class PaginatedTenants extends Paginated(Tenant) {}