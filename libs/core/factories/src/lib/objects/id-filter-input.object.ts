import {
  BaseObject,
  Id,
  IdConstraints,
  Property,
  optional,
} from '@garrettmk/class-schema';

export class IdFilterInput extends BaseObject implements IdConstraints {
  @Property(() => Id, { optional })
  eq?: Id;

  @Property(() => Id, { optional })
  ne?: Id;

  @Property(() => [Id], { optional })
  in?: Id[];

  @Property(() => [Id], { optional })
  nin?: Id[];
}
