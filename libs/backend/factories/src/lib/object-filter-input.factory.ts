import { BaseObject, BaseObjectConstructor, ClassContext, Constraints, Constructor, getTypeInfo, isArrayField, PropertiesMetadata, PropertiesMetadataManager, PropertyMetadata } from "@garrettmk/class-schema";
import { applyActions, applyActionsToProperties, ifMetadata, MetadataAction, PropertyContext, updateMetadata } from "@garrettmk/metadata-actions";
import { MetadataKey } from "@garrettmk/metadata-manager";
import { FilterTypesRegistry, isFilterableField } from "./registries/filter-types.registry";
import { omitProperties } from "./util/omit-properties";

export type ObjectFilterInput<T extends object, K extends keyof T = keyof T> = Pick<T, K>;

export function ObjectFilterInput<T extends object>(objectType: Constructor<T>) : BaseObjectConstructor<Constraints<T>> {
    const objectPropertiesMetadata = PropertiesMetadataManager.getMetadata(objectType);
    const context: ClassContext = { target: objectType };
    const name = `${objectType.name}FilterInput`;
    const omitted: MetadataKey[] = [];
    const addToOmittedList: MetadataAction<PropertyMetadata, PropertyContext> = (_, context) => { omitted.push(context.propertyKey); };
    const removeOmittedFields: MetadataAction<PropertiesMetadata> = (metadata) => omitProperties(metadata, omitted);

    const propertiesMetadata = applyActions(objectPropertiesMetadata, context, [
        applyActionsToProperties([
            ifMetadata(isFilterableField, [
                updateMetadata(meta => ({
                    type: isArrayField(meta) 
                        ? () => [FilterTypesRegistry.getFilterType(getTypeInfo(meta.type).innerType as Constructor)]
                        : () => FilterTypesRegistry.getFilterType(getTypeInfo(meta.type).type as Constructor)
                }))
            ], [
                addToOmittedList
            ])
        ]),
        removeOmittedFields
    ]);

    const filterType = BaseObject.createClass<Constraints<T>>({ name, propertiesMetadata });
    FilterTypesRegistry.setMetadata(objectType, { filterType });
    
    return filterType;
}