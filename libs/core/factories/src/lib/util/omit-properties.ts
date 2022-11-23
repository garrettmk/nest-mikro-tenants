import { PropertiesMetadata } from '@garrettmk/class-schema';
import { entries } from '@garrettmk/metadata-actions';
import { MetadataKey } from '@garrettmk/metadata-manager';

export function omitProperties(
  metadata: PropertiesMetadata,
  omittedKeys: MetadataKey[]
): PropertiesMetadata {
  return entries(metadata).reduce((result, [propertyKey, propertyMetadata]) => {
    if (!omittedKeys.includes(propertyKey))
      result[propertyKey] = { ...propertyMetadata };

    return result;
  }, {} as PropertiesMetadata);
}
