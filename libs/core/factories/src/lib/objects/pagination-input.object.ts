import { BaseObject, Property, Int } from '@garrettmk/class-schema';

export class PaginationInput extends BaseObject {
  @Property(() => Int, { min: 0, default: 0 })
  offset!: number;

  @Property(() => Int, { min: 0, default: 10 })
  limit!: number;
}
