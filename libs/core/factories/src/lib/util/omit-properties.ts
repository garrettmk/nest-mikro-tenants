import { PropertiesMetadata } from '@garrettmk/class-schema';
import { MetadataKey, metadataEntries } from '@garrettmk/metadata-manager';


export function omitProperties(
  metadata: PropertiesMetadata,
  omittedKeys: MetadataKey[]
): PropertiesMetadata {
  return metadataEntries(metadata).reduce((result, [propertyKey, propertyMetadata]) => {
    if (!omittedKeys.includes(propertyKey))
      result[propertyKey] = { ...propertyMetadata };

    return result;
  }, {} as PropertiesMetadata);
}
