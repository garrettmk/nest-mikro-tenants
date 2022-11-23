import {
  Constraints,
  Constructor,
  optional,
  Property,
} from '@garrettmk/class-schema';
import { setClassName } from '../../../common/src/lib/set-class-name.util';

export type WhereInput<
  T extends object,
  F extends Constraints<T> = Constraints<T>
> = Constraints<T> & {
  _and?: F[];
  _or?: F[];
  _not?: F[];
};

export type WhereInputOptions = {
  name?: string;
};

export function WhereInput<
  T extends object,
  F extends Constraints<T> = Constraints<T>
>(
  objectType: Constructor<T>,
  filterType: Constructor<F>,
  options?: WhereInputOptions
): Constructor<WhereInput<T, F>> {
  const name = options?.name ?? `${objectType.name}WhereInput`;

  // @ts-expect-error class members not statically known
  class GeneratedWhereInputClass
    extends filterType
    implements WhereInput<T, F>
  {
    @Property(() => [filterType], { optional })
    _and?: F[];

    @Property(() => [filterType], { optional })
    _or?: F[];

    @Property(() => [filterType], { optional })
    _not?: F[];
  }

  setClassName(GeneratedWhereInputClass, name);

  return GeneratedWhereInputClass as Constructor<WhereInput<T, F>>;
}
