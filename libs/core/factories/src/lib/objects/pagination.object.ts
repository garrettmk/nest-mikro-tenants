import { Class, Int, Property, output } from '@garrettmk/class-schema';
import { PaginationInput } from './pagination-input.object';

@Class({ output })
export class Pagination extends PaginationInput {
  @Property(() => Int, { min: 0 })
  total!: number;
}
