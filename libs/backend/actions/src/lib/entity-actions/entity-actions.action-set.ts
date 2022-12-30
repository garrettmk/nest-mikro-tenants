import {
  BaseModelConstructor,
  ClassMetadata,
  ClassMetadataManager,
  entity,
  extendsBuiltInField,
  getTypeInfo,
  Id,
  isEnumField,
  isPrimaryKeyField,
  TypeFn,
  withPropertiesMetadata,
} from '@garrettmk/class-schema';
import {
  always,
  applyToProperties,
  ifMetadata,
  matchesMetadata,
  MetadataActionSetClass,
  option,
  transformContext,
} from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import cuid from 'cuid';
import { isEntityField, registerEntitySchema, toEntityBuilderContext } from './entity-actions.util';

export class EntityActions extends MetadataActionSetClass<ClassMetadata, Constructor>() {
  static manager = ClassMetadataManager;
  static actions = [
    /** Only process targets marked as entities */
    ifMetadata(
      matchesMetadata({ entity }),
      transformContext(toEntityBuilderContext, [
        withPropertiesMetadata([
          applyToProperties([
            option(isPrimaryKeyField, (meta, ctx) => {
              Object.assign(ctx.entity.properties, {
                [ctx.propertyKey]: {
                  type: Id.prototype instanceof String ? 'string' : 'number',
                  primary: true,
                  comment: meta.description,
                  onCreate: cuid,
                },
              });
            }),

            option(extendsBuiltInField, (meta, ctx) => {
              const { innerType, isArray } = getTypeInfo(meta.type);

              Object.assign(ctx.entity.properties, {
                [ctx.propertyKey]: {
                  type: innerType,
                  array: isArray,
                  nullable: meta.optional,
                  // @ts-expect-error unique only exists on scalar fields but it won't matter here
                  unique: meta.unique,
                  comment: meta.description,
                  onCreate: meta.default,
                  onUpdate: ctx.propertyKey === 'updatedAt' ? () => new Date() : undefined,
                },
              });
            }),

            option(isEnumField, (meta, ctx) => {
              const { innerType, isArray } = getTypeInfo(meta.type as TypeFn);

              Object.assign(ctx.entity.properties, {
                [ctx.propertyKey]: {
                  enum: true,
                  items: () => innerType,
                  array: isArray,
                  nullable: meta.optional,
                  // @ts-expect-error only on scalar fields
                  unique: meta.unique,
                  comment: meta.description,
                  onCreate: meta.default,
                },
              });
            }),

            option(isEntityField, (meta, ctx) => {
              const { innerType, isArray } = getTypeInfo<BaseModelConstructor | BaseModelConstructor[]>(meta.type);

              Object.assign(ctx.entity.properties, {
                [ctx.propertyKey]: {
                  entity: () => innerType,
                  array: isArray,
                  nullable: meta.optional,
                  comment: meta.description,
                  onCreate: meta.default,
                  reference:
                    'oneToOne' in meta && meta.oneToOne ? '1:1' :
                    'oneToMany' in meta && meta.oneToMany ? '1:m' :
                    'manyToOne' in meta && meta.manyToOne ? 'm:1' :
                    'manyToMany' in meta && meta.manyToMany ? 'm:n' :
                    undefined,
                },
              });
            }),

            option(always, (meta, ctx) => {
              console.warn(`Can't make field for ${ctx.target.name} entity: ${String(ctx.propertyKey)}`);
            }),
          ]),
        ]),

        registerEntitySchema,
      ])
    ),
  ];
}
