import { BaseModel, BaseObjectType, Id, optional, Property, unique } from '@garrettmk/class-schema';

export enum EventType {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE'
}


@BaseObjectType()
export class Event extends BaseModel {
  @Property(() => Id)
  objectId!: string;

  @Property(() => EventType)
  type!: EventType

  @Property(() => Object, { optional })
  payload?: object;

  @Property(() => Date)
  createdAt!: Date;
}

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


export class Tenant extends BaseModel {
  @Property(() => String, { unique })
  slug!: string;

  @Property(() => String)
  name!: string;

  @Property(() => Date)
  createdAt!: Date;

  @Property(() => Date)
  updatedAt!: Date;
}