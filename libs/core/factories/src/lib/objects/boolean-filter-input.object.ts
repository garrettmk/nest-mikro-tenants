import {
  BooleanConstraints,
  Property,
  optional,
  BaseObject,
  Class,
  input
} from '@garrettmk/class-schema';

@Class({ input })
export class BooleanFilterInput
  extends BaseObject
  implements BooleanConstraints
{
  @Property(() => Boolean, { optional, description: 'Match booleans that equal this value' })
  eq?: boolean;

  @Property(() => Boolean, { optional, description: 'Match booleans that do not equal this value' })
  ne?: boolean;
}
