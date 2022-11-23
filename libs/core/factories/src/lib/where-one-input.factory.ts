import {
  BaseObjectConstructor,
  Constraints,
  Constructor,
} from '@garrettmk/class-schema';
import { setClassName } from '../../../common/src/lib/set-class-name.util';
import { ObjectFilterInput } from './object-filter-input.factory';

export type WhereOneInput<T extends object, K extends keyof T = keyof T> = {
  [k in K]?: Constraints<T[k]>;
};

export type WhereOneInputOptions = {
  name?: string;
};

export function WhereOneInput<
  T extends object,
  K extends keyof T = keyof T,
  F extends ObjectFilterInput<T, K> = ObjectFilterInput<T, K>
>(
  objectType: Constructor<T>,
  filterType: Constructor<F>,
  options?: WhereOneInputOptions
): BaseObjectConstructor<WhereOneInput<T, K>> {
  const name = options?.name ?? `${objectType.name}WhereOneInput`;

  // @ts-expect-error class members not statically known
  class GeneratedWhereOneInputClass extends filterType {}

  setClassName(GeneratedWhereOneInputClass, name);

  return GeneratedWhereOneInputClass as unknown as BaseObjectConstructor<
    WhereOneInput<T, K>
  >;
}
