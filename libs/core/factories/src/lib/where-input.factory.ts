import { BaseObjectConstructor, ObjectConstraints, input, optional } from '@garrettmk/class-schema';
import { Constructor } from '@garrettmk/ts-utils';

export type WhereInput<T extends object, F extends ObjectConstraints<T> = ObjectConstraints<T>> = ObjectConstraints<T> & {
  _and?: F[];
  _or?: F[];
  _not?: F[];
};

export type WhereInputOptions = {
  name?: string;
  description?: string;
};

export function WhereInput<T extends object, F extends ObjectConstraints<T> = ObjectConstraints<T>>(
  objectType: Constructor<T>,
  filterType: BaseObjectConstructor<F>,
  options?: WhereInputOptions
): BaseObjectConstructor<WhereInput<T, F>> {
  const { name, description } = optionsWithDefaults(options, objectType);

  const whereType = filterType.createClass<WhereInput<T, F>>({
    name,
    classMetadata: {
      input, 
      description
    },
    propertiesMetadata: {
      _and: {
        type: () => [filterType],
        optional,
        description: 'Matches objects that match all of the given conditions'
      },
      _or: {
        type: () => [filterType],
        optional,
        description: 'Matches objects that match any of the given conditions'
      },
      _not: {
        type: () => [filterType],
        optional,
        description: 'Matches objects that match none of the given condtions'
      }
    }
  });

  return whereType;
}


/**
 * @internal
 * 
 * Return the options object with default values filled in.
 * 
 * @param options 
 * @param objectType 
 * @returns An options object with all values set
 */
 function optionsWithDefaults(options: WhereInputOptions | undefined, objectType: Constructor): Required<WhereInputOptions> {
  const {
    name = `${objectType.name}WhereInput`,
    description = `Query object for finding ${objectType.name} objects`
  } = options ?? {};

  return { name, description };
}