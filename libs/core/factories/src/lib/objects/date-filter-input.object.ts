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
  @Property(() => Date, { optional })
  min?: Date;

  @Property(() => Date, { optional })
  max?: Date;
}
