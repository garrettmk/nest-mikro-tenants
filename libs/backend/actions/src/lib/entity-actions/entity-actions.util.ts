import {
  ClassContext,
  ClassMetadata,
  BaseModel,
  PropertyMetadata,
  getTypeInfo,
  BaseModelConstructor,
  ClassMetadataManager,
} from '@garrettmk/class-schema';
import { TargetContext } from '@garrettmk/metadata-actions';
import { Constructor, doesExtend, isConstructor } from '@garrettmk/ts-utils';
import { EntitySchema } from '@mikro-orm/core';
import { EntitySchemaRegistry } from './entity-schema.registry';

export type EntityBuilderContext = ClassContext & {
  entity: any;
};

/** Build the entity schema in the context */
export function toEntityBuilderContext(
  metadata: ClassMetadata,
  context: TargetContext<Constructor>
): EntityBuilderContext {
  const { target } = context;
  const { abstract, schema, description } = metadata;

  return {
    ...context,
    entity: {
      class: target,
      abstract,
      schema,
      comment: description,
      properties: {},
    },
  };
}

/** Type guard for model fields */
export function isEntityField(
  meta: PropertyMetadata
): meta is PropertyMetadata<BaseModelConstructor | BaseModelConstructor[]> {
  const { innerType } = getTypeInfo(meta.type);
  if (!isConstructor(innerType) || !ClassMetadataManager.hasMetadata(innerType))
    return false;

  const { entity } = ClassMetadataManager.getMetadata(innerType);

  return !!entity;
}

/** Create and register an EntitySchema */
export function registerEntitySchema(metadata: ClassMetadata, context: EntityBuilderContext) {
  const { target, entity } = context;
  const entitySchema = new EntitySchema(entity);

  EntitySchemaRegistry.setEntitySchema(target, entitySchema);
}
