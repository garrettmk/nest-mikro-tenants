import {
  BaseObject,
  BaseObjectConstructor, output
} from '@garrettmk/class-schema';
import { Constructor } from '@garrettmk/ts-utils';
import { Pagination } from './objects/pagination.object';

export type Paginated<T> = {
  pagination: Pagination;
  items: T[];
};

export type PaginatedOptions = {
  name?: string
  description?: string
}

export function Paginated<Obj extends BaseObject>(
  objectType: Constructor<Obj>,
  options?: PaginatedOptions
): BaseObjectConstructor<Paginated<Obj>> {
  const { name, description } = optionsWithDefaults(options, objectType);

  return BaseObject.createClass<Paginated<Obj>>({
    name,
    classMetadata: {
      output,
      description
    },
    propertiesMetadata: {
      pagination: {
        type: () => Pagination,
        description: 'Pagination data'
      },
      items: {
        type: () => [objectType],
        description: 'An array of items'
      }
    }
  });
}


function optionsWithDefaults(options: PaginatedOptions | undefined, objectType: Constructor): Required<PaginatedOptions> {
  const {
    name = `Paginated${objectType.name}s`,
    description = `A paginated list of ${objectType.name} objects`
  } = options ?? {};

  return {
    name,
    description
  };
}