import {
  BaseObject,
  Int,
  NumberConstraints,
  Property,
  optional,
  Class,
  input
} from '@garrettmk/class-schema';

@Class({ input })
export class IntFilterInput extends BaseObject implements NumberConstraints {
  @Property(() => Int, { optional, description: 'Matches numbers greater than or equal to the given value' })
  min?: number;

  @Property(() => Int, { optional, description: 'Matches numbers less than or equal to the given value' })
  max?: number;

  @Property(() => Int, { optional, description: 'Matches numbers that equal the given value' })
  eq?: number;

  @Property(() => Int, { optional, description: 'Matches all numbers except the given value' })
  ne?: number;

  @Property(() => [Int], { optional, description: 'Matches all numbers in the given list' })
  in?: number[];

  @Property(() => [Int], { optional, description: 'Matches all numbers except the given values' })
  nin?: number[];
}
