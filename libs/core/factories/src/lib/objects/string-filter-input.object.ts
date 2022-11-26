import {
  BaseObject,
  Property,
  StringConstraints,
  optional,
  Int,
  Class,
  input
} from '@garrettmk/class-schema';

@Class({ input })
export class StringFilterInput extends BaseObject implements StringConstraints {
  @Property(() => RegExp, { optional })
  matches?: RegExp;

  @Property(() => Int, { optional })
  minLength?: number;

  @Property(() => Int, { optional })
  maxLength?: number;

  @Property(() => [String], { optional })
  in?: string[];

  @Property(() => [String], { optional })
  nin?: string[];
}
