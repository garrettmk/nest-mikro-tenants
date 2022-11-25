import { getTypeInfo, PropertyMetadata } from "@garrettmk/class-schema";
import { MetadataAction } from "@garrettmk/metadata-actions";


export function substituteType(newTypeFn: (meta: PropertyMetadata) => unknown): MetadataAction<PropertyMetadata> {
    return function (metadata) {
        const newType = newTypeFn(metadata);
        const { isArray } = getTypeInfo(metadata.type);
        const type = isArray ? () => [newType] : () => newType;

        return {
            ...metadata,
            type
        }
    }
}