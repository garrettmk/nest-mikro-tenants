import { BaseModel, Class, entity, optional, output, Property, unique } from "@garrettmk/class-schema";
import { Pick, CreateInput, ObjectFilterInput, UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";

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


export class UserCreateInput extends CreateInput(User, {
  required: ['username', 'email', 'password'],
  omitted: ['createdAt', 'updatedAt'],
}) {}


export class UserUpdateInput extends UpdateInput(User, {
  omitted: ['createdAt', 'updatedAt'],
}) {}


export class UserFilterInput extends ObjectFilterInput(User) {}

export class UserFilterOneInput extends Pick(UserFilterInput, ['id', 'username', 'email']) {}

export class UsersWhereInput extends WhereInput(User, UserFilterInput) {}

export class UsersWhereOneInput extends WhereOneInput(User, UserFilterOneInput) {}
