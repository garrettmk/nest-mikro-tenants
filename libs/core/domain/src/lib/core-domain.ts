import { BaseModel, Class, Id, optional, Property, unique, output, entity } from '@garrettmk/class-schema';

export enum EventType {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE'
}


@Class({ output, entity })
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


@Class({ output, entity })
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