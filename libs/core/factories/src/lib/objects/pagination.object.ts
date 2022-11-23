import { Int, Property } from '@garrettmk/class-schema';
import { PaginationInput } from './pagination-input.object';

export class Pagination extends PaginationInput {
  @Property(() => Int, { min: 0 })
  total!: number;
}
