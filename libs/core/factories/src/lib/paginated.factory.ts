import {
  BaseObject,
  BaseObjectConstructor,
  Property,
  output,
  Class
} from '@garrettmk/class-schema';
import { Constructor } from '@garrettmk/ts-utils';
import { Pagination } from './objects/pagination.object';

export type Paginated<T> = {
  pagination: Pagination;
  items: T[];
};

export function Paginated<Obj extends BaseObject>(
  objectType: Constructor<Obj>
): BaseObjectConstructor<Paginated<Obj>> {
  @Class({ output, description: `A paginated list of ${objectType.name} objects`})
  class GeneratedPaginatedClass extends BaseObject implements Paginated<Obj> {
    @Property(() => Pagination)
    pagination!: Pagination;

    @Property(() => [objectType])
    items!: Obj[];
  }

  return GeneratedPaginatedClass;
}
