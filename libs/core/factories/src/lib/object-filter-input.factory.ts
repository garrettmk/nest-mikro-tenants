import {
  BaseObject,
  BaseObjectConstructor,
  ClassContext, innerType,
  input,
  ObjectConstraints,
  PropertiesMetadata,
  PropertiesMetadataManager,
  PropertyMetadata
} from '@garrettmk/class-schema';
import { applyActions, applyActionsToProperties, ifMetadata, PropertyContext, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKey } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
import { FilterTypesRegistry, isFilterableField } from './registries/filter-types.registry';
import { omitProperties } from './util/omit-properties';


export type ObjectFilterInputOptions = {
  name?: string
  description?: string,
  abstract?: boolean
};

export function ObjectFilterInput<T extends object>(
  objectType: Constructor<T>,
  options?: ObjectFilterInputOptions
): BaseObjectConstructor<ObjectConstraints<T>> {
  const { name, description, abstract } = optionsWithDefaults(options, objectType);

  const filterType = BaseObject.createClass<ObjectConstraints<T>>({
    name,
    classMetadata: {
      input,
      description,
      abstract
    },
    propertiesMetadata: toObjectFilterMetadata(objectType),
  });

  FilterTypesRegistry.setFilterType(objectType, filterType);

  return filterType;
}

function optionsWithDefaults(
  options: ObjectFilterInputOptions | undefined,
  objectType: Constructor
): Required<ObjectFilterInputOptions> {
  return {
    name: options?.name ?? options?.abstract ? `Abstract${objectType.name}FilterInput` : `${objectType.name}FilterInput`,
    description: options?.description ?? `DTO for filtering ${objectType.name} objects`,
    abstract: options?.abstract ?? false
  };
}

function toObjectFilterMetadata(target: Constructor): PropertiesMetadata {
  const targetPropertiesMeta = PropertiesMetadataManager.getMetadata(target);
  const targetContext: ClassContext = { target };
  const { addToOmittedList, removeOmittedFields } = omitFieldsActions();

  return applyActions(targetPropertiesMeta, targetContext, [
    applyActionsToProperties(
      ifMetadata(
        isFilterableField,
        updateMetadata((meta, ctx) => ({
          type: () => FilterTypesRegistry.getFilterType(innerType(meta.type) as unknown as Constructor),
          description: `Filter objects on the ${String(ctx.propertyKey)} property`
        })),
        addToOmittedList
      )
    ),
    removeOmittedFields,
  ]);
}

function omitFieldsActions() {
  const omitted: MetadataKey[] = [];

  return {
    addToOmittedList(metadata: PropertyMetadata, context: PropertyContext) {
      omitted.push(context.propertyKey);
    },

    removeOmittedFields(metadata: PropertiesMetadata) {
      return omitProperties(metadata, omitted);
    },
  };
}
