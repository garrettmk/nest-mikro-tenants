import {
  and,
  BaseObject,
  BaseObjectConstructor, ClassMetadata, ObjectConstraints,
  PropertiesMetadata,
  PropertiesMetadataManager,
  PropertyMetadata,
  withMetadata
} from '@garrettmk/class-schema';
import { applyToProperties, ifMetadata, MetadataSelector, PropertyContext, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKey } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
import { FactoryActions } from './registries/deferred-actions.registry';
import { FilterTypesRegistry } from './registries/filter-types.registry';
import { omitProperties } from './util/omit-properties';

/**
 * Options for `ObjectFilterInput`
 */
export type ObjectFilterOptions<T extends object, K extends keyof T = keyof T> = ClassMetadata & {
  name?: string
  register?: boolean
  keys?: K[]
};

/**
 * @param objectType The constructor of the object to build a filter for
 * @param options Options for the generated class
 * @returns A new class implementing the `Constraints` for the object type
 */
export function ObjectFilter<T extends object, K extends keyof T = keyof T>(
  objectType: Constructor<T>,
  options?: ObjectFilterOptions<T, K>
): BaseObjectConstructor<Pick<ObjectConstraints<T>, K>> {
  const { name, register, keys, ...classMetadata } = optionsWithDefaults(options, objectType);
  const objectPropertiesMetadata = PropertiesMetadataManager.getMetadata(objectType);
  const { addToOmittedList, removeOmittedFields } = omitFieldsActions();

  const filterType = BaseObject.createClass<Pick<ObjectConstraints<T>, K>>({
    name,
    classMetadata,
    propertiesMetadata: {},
  });

  const isSelectedProperty: MetadataSelector<PropertyMetadata, PropertyContext> = (meta, ctx) => {
    return !keys || keys.includes(ctx.propertyKey);
  }

  FactoryActions.setMetadata(filterType, {
    propertiesActions: withMetadata(objectPropertiesMetadata, [
      applyToProperties([
        ifMetadata(

          // If it's a selected + filterable field...
          and(
            FilterTypesRegistry.isFilterableField,
            isSelectedProperty
          ) as MetadataSelector<PropertyMetadata, PropertyContext>,

          // then set the filter metadata
          updateMetadata((meta, ctx) => ({
            type: FilterTypesRegistry.getFilterTypeFn(meta.type),
            optional: true,
            description: `Filter on the ${String(ctx.propertyKey)} property`
          })),

          // else, omit the field
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
  options: ObjectFilterOptions<any> | undefined,
  objectType: Constructor
): { name: string } & ObjectFilterOptions<any> {
  const name = 
    options?.name ? options.name :
    options?.abstract ? `Abstract${objectType.name}FilterInput` :
    `${objectType.name}FilterInput`;

  return {
    name: name,
    
    description: options?.description ?? `DTO for filtering ${objectType.name} objects`,

    keys: options?.keys
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
