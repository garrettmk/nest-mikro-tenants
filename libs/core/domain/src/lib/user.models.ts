import {
  abstract,
  BaseModel,
  BaseObject,
  BaseObjectConstructor,
  Class,
  entity,
  hidden,
  input,
  manyToMany,
  optional,
  output,
  Property,
  unique,
} from '@garrettmk/class-schema';
import { Constructor } from '@garrettmk/ts-utils';
import {
  CreateInput,
  FiltersType,
  ObjectFilter,
  Paginated,
  Pick,
  UpdateInput,
  WhereInput,
  WhereOneInput,
} from '@nest-mikro-tenants/core/factories';
import { Tenant } from './tenant.models';
import { faker } from '@faker-js/faker';
import { shake, mapValues } from 'radash';

@Class({ output, entity, description: 'An application user' })
export class User extends BaseModel {
  @Property(() => String, { unique, minLength: 2, description: "The user's unique username" })
  username!: string;
  
  @Property(() => String, { hidden, description: "The user's password" })
  password!: string;
  
  @Property(() => String, { unique, description: "The user's unique email address" })
  email!: string;
  
  @Property(() => String, { optional, minLength: 2, description: "The user's human name" })
  nickname?: string;
  
  @Property(() => Date, {
    default: () => new Date(),
    description: 'The datetime this user was created',
  })
  createdAt!: Date;
  
  @Property(() => Date, {
    default: () => new Date(),
    description: 'The datetime this user was last updated',
  })
  updatedAt!: Date;
  
  // Relations
  
  // @Property(() => [Tenant], { manyToMany, description: 'The tenants this user belongs to' })
  // tenants?: Tenant[];
  
  // BaseModel overrides
  static fakeValues<T extends BaseObject>(this: BaseObjectConstructor<T>): T {
    const metadata = this.getPropertiesMetadata();
    const fakerValues = shake(mapValues(metadata, propertyMetadata => propertyMetadata.faker?.()));
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      ...fakerValues,
      username: faker.internet.userName(firstName, lastName),
      password: faker.internet.password(),
      email: faker.internet.email(firstName, lastName),
      nickname: firstName,
      tenants: []
    } as unknown as T;
  }
}

@Class({ input })
export class UserCreateInput extends CreateInput(User, {
  required: ['username', 'email', 'password'],
  omitted: ['createdAt', 'updatedAt'],
  abstract,
}) {}

@Class({ input })
export class UserUpdateInput extends UpdateInput(User, {
  omitted: ['createdAt', 'updatedAt'],
  abstract,
}) {
  @Property(() => String, { optional })
  password?: string;
}

@FiltersType(User)
@Class({ input })
export class UserFilterInput extends ObjectFilter(User) {}

@Class({ input })
export class UserFilterOneInput extends Pick(UserFilterInput, ['id', 'username', 'email']) {}

@Class({ input })
export class UsersWhereInput extends WhereInput(User, UserFilterInput) {}

@Class({ input })
export class UsersWhereOneInput extends WhereOneInput(User, UserFilterOneInput) {}

@Class({ output })
export class PaginatedUsers extends Paginated(User) {}
