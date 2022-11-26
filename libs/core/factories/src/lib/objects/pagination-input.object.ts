import { BaseObject, Property, Int, Class, input } from '@garrettmk/class-schema';

@Class({ input })
export class PaginationInput extends BaseObject {
  @Property(() => Int, { min: 0, default: 0 })
  offset!: number;

  @Property(() => Int, { min: 0, default: 10 })
  limit!: number;
}
