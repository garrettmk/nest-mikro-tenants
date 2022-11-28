import {
  BaseObject,
  Id,
  IdConstraints,
  Property,
  optional,
  Class,
  input
} from '@garrettmk/class-schema';

@Class({ input })
export class IdFilterInput extends BaseObject implements IdConstraints {
  @Property(() => Id, { optional, description: 'Match the ID that equals this value' })
  eq?: Id;

  @Property(() => Id, { optional, description: 'Match any ID except the given value' })
  ne?: Id;

  @Property(() => [Id], { optional, description: 'Matches IDs that equal one of the given values' })
  in?: Id[];

  @Property(() => [Id], { optional, description: 'Matches any ID except the given values' })
  nin?: Id[];
}
