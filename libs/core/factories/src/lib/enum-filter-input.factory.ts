import { BaseObject, BaseObjectConstructor, Enum, EnumConstraints, input, optional } from '@garrettmk/class-schema';

export type EnumFilterOptions = {
  name?: string;
  description?: string;
};

export function EnumFilterInput<EnumObject extends Enum>(
  enumObject: EnumObject,
  name: string,
  options?: EnumFilterOptions
): BaseObjectConstructor<EnumConstraints<EnumObject>> {
  const { description, name: _name } = optionsWithDefaults(options, name);

  const filterType = BaseObject.createClass<EnumConstraints<EnumObject>>({
    name: _name,
    classMetadata: {
      input,
      description,
    },
    propertiesMetadata: {
      in: {
        type: () => [enumObject],
        optional,
      },
      nin: {
        type: () => [enumObject],
        optional,
      },
    },
  });

  return filterType;
}

function optionsWithDefaults(options: EnumFilterOptions | undefined, name: string): Required<EnumFilterOptions> {
  return {
    name: `${name}FilterInput`,
    description: `DTO for filtering ${name} values`,
  };
}
