import {
  BaseObject,
  BaseObjectConstructor, ClassMetadata, ObjectConstraints,
  PropertiesMetadata,
  PropertiesMetadataManager,
  PropertyMetadata,
  withMetadata
} from '@garrettmk/class-schema';
import { applyToProperties, ifMetadata, PropertyContext, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKey } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
import { DeferredActionsRegistry } from './registries/deferred-actions.registry';
import { FilterTypesRegistry } from './registries/filter-types.registry';
import { omitProperties } from './util/omit-properties';

/**
 * Options for `ObjectFilterInput`
 */
export type ObjectFilterOptions = ClassMetadata & {
  name?: string
  register?: boolean
};

/**
 * @param objectType The constructor of the object to build a filter for
 * @param options Options for the generated class
 * @returns A new class implementing the `Constraints` for the object type
 */
export function ObjectFilter<T extends object>(
  objectType: Constructor<T>,
  options?: ObjectFilterOptions
): BaseObjectConstructor<ObjectConstraints<T>> {
  const { name, register, ...classMetadata } = optionsWithDefaults(options, objectType);
  const objectPropertiesMetadata = PropertiesMetadataManager.getMetadata(objectType);
  const { addToOmittedList, removeOmittedFields } = omitFieldsActions();

  const filterType = BaseObject.createClass<ObjectConstraints<T>>({
    name,
    classMetadata,
    propertiesMetadata: {},
  });

  DeferredActionsRegistry.setMetadata(filterType, {
    propertiesActions: withMetadata(objectPropertiesMetadata, [
      applyToProperties([
        ifMetadata(
          FilterTypesRegistry.isFilterableField,
          updateMetadata((meta, ctx) => ({
            type: FilterTypesRegistry.getFilterTypeFn(meta.type),
            optional: true,
            description: `Filter on the ${String(ctx.propertyKey)} property`
          })),
          addToOmittedList
        ),
      ]),
      removeOmittedFields
    ])
  });

  if (register)
    FilterTypesRegistry.setFilterType(objectType, filterType);

  return filterType;
}


/**
 * @internal
 * @param options An optional options object
 * @param objectType The target class constructor
 * @returns `options` with defaults filled in
 */
function optionsWithDefaults(
  options: ObjectFilterOptions | undefined,
  objectType: Constructor
): { name: string } & ObjectFilterOptions {
  return {
    name: options?.name ?? options?.abstract
      ? `Abstract${objectType.name}FilterInput`
      : `${objectType.name}FilterInput`,

    description: options?.description ?? `DTO for filtering ${objectType.name} objects`,
  };
}

/**
 * @internal
 * @returns Actions for adding fields to a list, and removing those
 *          fields from metadata
 */
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
