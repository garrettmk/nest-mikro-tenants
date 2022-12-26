import { BaseModel, BaseModelConstructor, ClassContext, ClassMetadata, ClassMetadataManager, entity, extendsBuiltInField, getTypeInfo, Id, isEnumField, isPrimaryKeyField, PropertyMetadata, TypeFn, withPropertiesMetadata } from "@garrettmk/class-schema";
import { always, applyToProperties, ifMetadata, matchesMetadata, MetadataActionSet, option, transformContext } from "@garrettmk/metadata-actions";
import { Constructor, doesExtend, isConstructor, MaybeArray } from "@garrettmk/ts-utils";
import { EntitySchema } from "@mikro-orm/core";
import cuid from "cuid";
import { EntitySchemaRegistry } from "./entity-registry";


export type EntityBuilderContext = ClassContext & {
    entity: any
}

export const EntityActions = new MetadataActionSet<ClassMetadata, Constructor>(ClassMetadataManager, [
    ifMetadata(
        matchesMetadata({ entity }),
        transformContext(
            toEntityBuilderContext, [
                withPropertiesMetadata([
                    applyToProperties([
                        option(isPrimaryKeyField, (meta, ctx) => {
                            Object.assign(ctx.entity.properties, {
                                [ctx.propertyKey]: {
                                    type: Id.prototype instanceof String ? 'string' : 'number',
                                    primary: true,
                                    comment: meta.description,
                                    onCreate: cuid,
                                }
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
                                    onUpdate: ctx.propertyKey === 'updatedAt' 
                                        ? () => new Date()
                                        : undefined
                                }
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
                                    onCreate: meta.default
                                }
                            })
                        }),

                        option(isEntityField, (meta, ctx) => {
                            // @ts-expect-error idk
                            const { innerType, isArray } = getTypeInfo(meta.type);

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
                                        undefined
                                }
                            });
                        }),

                        option(always, (meta, ctx) => {
                            console.log(`Can't make field for ${ctx.target.name} entity: ${String(ctx.propertyKey)}`);
                        })
                    ])
                ]),
                
                (meta, ctx) => {
                    const { target } = ctx;

                    Object.assign(ctx.entity, {
                        class: target,
                        abstract: meta.abstract,
                        schema: meta.schema,
                        comment: meta.description,
                    });
                },

                registerEntitySchema
            ]
        )
    )
]);


function toEntityBuilderContext(metadata: ClassMetadata, context: ClassContext): EntityBuilderContext {
    return {
        ...context,
        entity: {
            properties: {}
        },
    };
}

function isEntityField<T extends BaseModelConstructor>(meta: PropertyMetadata): meta is PropertyMetadata<MaybeArray<T>> {
    const { innerType } = getTypeInfo(meta.type);

    return isConstructor(innerType) && doesExtend(innerType, BaseModel);
}

function registerEntitySchema(metadata: ClassMetadata, context: EntityBuilderContext) {
    const { target, entity } = context;
    const entitySchema = new EntitySchema(entity);

    EntitySchemaRegistry.setEntitySchema(target, entitySchema);
}
