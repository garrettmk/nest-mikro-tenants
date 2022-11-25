import { BaseObjectConstructor, input, ObjectConstraints } from '@garrettmk/class-schema';
import { Constructor } from '@garrettmk/ts-utils';


/**
 * WhereOneInput is a subset of the object's constraints filter.
 */
export type WhereOneInput<T extends object, K extends keyof T = keyof T> = ObjectConstraints<T, K>;

/**
 * Options for creating a WhereOneInput.
 */
export type WhereOneInputOptions = {
  name?: string
  description?: string
};

/**
 * Creates and returns a new class, implementing the WhereOneInput interface
 * for the given object type.
 * 
 * @param objectType 
 * @param filterType 
 * @param options 
 * @returns 
 */
export function WhereOneInput<
  T extends object,
  K extends keyof T = keyof T,
  F extends ObjectConstraints<T> = ObjectConstraints<T>
>(
  objectType: Constructor<T>,
  filterType: BaseObjectConstructor<F>,
  options?: WhereOneInputOptions
): BaseObjectConstructor<WhereOneInput<T, K>> {
  const { name, description } = optionsWithDefaults(options, objectType);

  const whereOneType = filterType.createClass<WhereOneInput<T, K>>({
    name,
    classMetadata: {
      input,
      description
    }
  });
  
  return whereOneType;
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
function optionsWithDefaults(options: WhereOneInputOptions | undefined, objectType: Constructor): Required<WhereOneInputOptions> {
  const {
    name = `${objectType.name}WhereOneInput`,
    description = `Query object for finding a unique ${objectType.name}`
  } = options ?? {};

  return { name, description };
}