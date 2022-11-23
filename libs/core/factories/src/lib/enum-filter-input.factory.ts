import {
  BaseObject,
  BaseObjectConstructor,
  Enum,
  EnumConstraints,
  Property,
  Values,
  optional,
} from '@garrettmk/class-schema';
import { setClassName } from '../../../common/src/lib/set-class-name.util';

export function EnumFilterInput<EnumObject extends Enum>(
  enumObject: EnumObject,
  name: string
): BaseObjectConstructor<EnumConstraints<EnumObject>> {
  class GeneratedEnumFilterClass
    extends BaseObject
    implements EnumConstraints<EnumObject>
  {
    @Property(() => [enumObject as Enum], { optional })
    in?: Values<EnumObject>[];

    @Property(() => [enumObject as Enum], { optional })
    nin?: Values<EnumObject>[];
  }

  setClassName(GeneratedEnumFilterClass, name);

  return GeneratedEnumFilterClass;
}
