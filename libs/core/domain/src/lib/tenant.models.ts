import { abstract, BaseModel, Class, entity, input, output, Property, unique, manyToMany } from "@garrettmk/class-schema";
import { CreateInput, ObjectFilterInput, Paginated, Pick, UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { User } from "./user.models";

@Class({ output, entity, description: 'An application tenant'})
export class Tenant extends BaseModel {
    @Property(() => String, { unique, minLength: 2 })
    name!: string;

    @Property(() => String, { unique, minLength: 2 })
    slug!: string;

    @Property(() => Date, { default: () => new Date() })
    createdAt!: Date;

    @Property(() => Date, { default: () => new Date() })
    updatedAt!: Date;

    // Relations
    @Property(() => [User], { manyToMany })
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

@Class({ input })
export class TenantFilterInput extends ObjectFilterInput(Tenant) {}

@Class({ input })
export class TenantFilterOneInput extends Pick(TenantFilterInput, ['id', 'name', 'slug']) {}

@Class({ input })
export class TenantsWhereInput extends WhereInput(Tenant, TenantFilterInput) {}

@Class({ input })
export class TenantsWhereOneInput extends WhereOneInput(Tenant, TenantFilterOneInput) {}

@Class({ output })
export class PaginatedTenants extends Paginated(Tenant) {}