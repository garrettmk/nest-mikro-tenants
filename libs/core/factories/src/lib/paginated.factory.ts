import {
  BaseObject,
  BaseObjectConstructor,
  Constructor,
  Property,
} from '@garrettmk/class-schema';
import { Pagination } from './objects/pagination.object';

export type Paginated<T> = {
  pagination: Pagination;
  items: T[];
};

export function Paginated<Obj extends BaseObject>(
  objectType: Constructor<Obj>
): BaseObjectConstructor<Paginated<Obj>> {
  class GeneratedPaginatedClass extends BaseObject implements Paginated<Obj> {
    @Property(() => Pagination)
    pagination!: Pagination;

    @Property(() => [objectType])
    items!: Obj[];
  }

  return GeneratedPaginatedClass;
}
