import { BaseModel, Class, entity, optional, input, output, Property, unique } from "@garrettmk/class-schema";
import { Pick, CreateInput, ObjectFilterInput, UpdateInput, WhereInput, WhereOneInput, Paginated } from "@nest-mikro-tenants/core/factories";

@Class({ output, entity, description: 'An application user' })
export class User extends BaseModel {
  @Property(() => String, { unique, minLength: 2 })
  username!: string;

  @Property(() => String)
  password!: string;

  @Property(() => String, { unique })
  email!: string;

  @Property(() => String, { optional, minLength: 2 })
  nickname?: string;

  @Property(() => Date)
  createdAt!: Date;

  @Property(() => Date)
  updatedAt!: Date;
}


@Class({ input })
export class UserCreateInput extends CreateInput(User, {
  required: ['username', 'email', 'password'],
  omitted: ['createdAt', 'updatedAt'],
}) {}

@Class({ input })
export class UserUpdateInput extends UpdateInput(User, {
  omitted: ['createdAt', 'updatedAt'],
}) {}


@Class({ input })
export class UserFilterInput extends ObjectFilterInput(User) {}

@Class({ input })
export class UserFilterOneInput extends Pick(UserFilterInput, ['id', 'username', 'email']) {}

@Class({ input })
export class UsersWhereInput extends WhereInput(User, UserFilterInput) {}

@Class({ input })
export class UsersWhereOneInput extends WhereOneInput(User, UserFilterOneInput) {}

@Class({ output })
export class PaginatedUsers extends Paginated(User) {}