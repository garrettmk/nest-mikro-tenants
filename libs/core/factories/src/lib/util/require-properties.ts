import { PropertiesMetadata } from '@garrettmk/class-schema';
import { MetadataKey, metadataEntries } from '@garrettmk/metadata-manager';

export function requireProperties(
    metadata: PropertiesMetadata,
    requiredKeys: MetadataKey[]
): PropertiesMetadata {
    return metadataEntries(metadata).reduce((result, [propertyKey, propertyMetadata]) => {
        result[propertyKey] = { ...propertyMetadata };

        if (requiredKeys.includes(propertyKey)) delete result[propertyKey]['optional'];

        return result;
    }, {} as PropertiesMetadata);
}
