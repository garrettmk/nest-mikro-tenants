import {
  BaseObject,
  NumberConstraints,
  Property,
  optional,
  Class,
  input
} from '@garrettmk/class-schema';


@Class({ input })
export class NumberFilterInput extends BaseObject implements NumberConstraints {
  @Property(() => Number, { optional })
  min?: number;

  @Property(() => Number, { optional })
  max?: number;

  @Property(() => Number, { optional })
  eq?: number;

  @Property(() => Number, { optional })
  ne?: number;

  @Property(() => [Number], { optional })
  in?: number[];

  @Property(() => [Number], { optional })
  nin?: number[];
}
