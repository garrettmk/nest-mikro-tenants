import {
  BaseObject,
  Float,
  NumberConstraints,
  Property,
  optional,
  Class,
  input
} from '@garrettmk/class-schema';

@Class({ input })
export class FloatFilterInput extends BaseObject implements NumberConstraints {
  @Property(() => Float, { optional, description: 'Match numbers greater than or equal to this value' })
  min?: number;

  @Property(() => Float, { optional, description: 'Match numbers less than or equal to this value' })
  max?: number;

  @Property(() => Float, { optional, description: 'Match numbers that equal this value' })
  eq?: number;

  @Property(() => Float, { optional, description: 'Match numbers that do not equal this value' })
  ne?: number;

  @Property(() => [Float], { optional, description: 'Match numbers that equal one of the given values' })
  in?: number[];

  @Property(() => [Float], { optional, description: 'Match numbers that do not equal one of the given values,' })
  nin?: number[];
}
