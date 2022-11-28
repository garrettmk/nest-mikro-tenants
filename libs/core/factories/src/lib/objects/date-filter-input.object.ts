import {
  BaseObject,
  DateConstraints,
  Property,
  optional,
  Class,
  input
} from '@garrettmk/class-schema';

@Class({ input })
export class DateFilterInput extends BaseObject implements DateConstraints {
  @Property(() => Date, { optional, description: 'Match dates after this value' })
  min?: Date;

  @Property(() => Date, { optional, description: 'Match dates before this value' })
  max?: Date;
}
