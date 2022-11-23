import { BaseObjectConstructor, Constructor, getTypeInfo, PropertyMetadata } from "@garrettmk/class-schema"
import { MetadataSelector } from "@garrettmk/metadata-actions"
import { ClassMetadataDecoratorFn, MetadataManagerClass } from "@garrettmk/metadata-manager"

export type FilterTypeMetadata = {
    filterType: BaseObjectConstructor
}

export class FilterTypesRegistry extends MetadataManagerClass<FilterTypeMetadata, Constructor>() {
    static getFilterType(target: Constructor) {
        const { filterType } = this.getMetadata(target);
        return filterType;
    }
}

export const FilterTypeMeta = ClassMetadataDecoratorFn(FilterTypesRegistry);

export const isFilterableField: MetadataSelector<PropertyMetadata> = (metadata) => {
    const { innerType } = getTypeInfo(metadata.type);

    return FilterTypesRegistry.hasMetadata(innerType as Constructor);
}