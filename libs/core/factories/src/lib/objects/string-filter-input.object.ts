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
  @Property(() => RegExp, { optional, description: 'Matches strings that match the given RegExp' })
  matches?: RegExp;

  @Property(() => Int, { optional, description: 'Matches strings whose length is greater than or equal to the given value' })
  minLength?: number;

  @Property(() => Int, { optional, description: 'Matches strings whose length is less than or equal to the given value' })
  maxLength?: number;

  @Property(() => [String], { optional, description: 'Matches strings in the given list of values' })
  in?: string[];

  @Property(() => [String], { optional, description: 'Matches all strings not in the given list' })
  nin?: string[];
}
