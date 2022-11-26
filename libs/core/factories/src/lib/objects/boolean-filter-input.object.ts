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
  @Property(() => Boolean, { optional })
  eq?: boolean;

  @Property(() => Boolean, { optional })
  ne?: boolean;
}
