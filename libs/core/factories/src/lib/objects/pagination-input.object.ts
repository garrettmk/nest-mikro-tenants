import { BaseObject, Property, Int, Class, input } from '@garrettmk/class-schema';

@Class({ input })
export class PaginationInput extends BaseObject {
  @Property(() => Int, { min: 0, default: () => 0, description: 'The index of the first item to return' })
  offset!: number;

  @Property(() => Int, { min: 0, default: () => 10, description: 'The number of items to return' })
  limit!: number;
}
