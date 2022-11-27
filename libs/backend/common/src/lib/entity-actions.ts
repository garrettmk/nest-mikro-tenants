import { applyActionsToPropertyMetadata, ClassContext, ClassMetadata, ClassPropertyContext, decorateClassWith, decoratePropertyWith, entity, innerType, isArrayField, isEnumField, primaryKey, PropertyMetadata } from "@garrettmk/class-schema";
import { ifMetadata, matchesMetadata, MetadataAction } from "@garrettmk/metadata-actions";
import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";


export const entityPropertyActions: MetadataAction<PropertyMetadata, ClassPropertyContext>[] = [
    ifMetadata(
        matchesMetadata({ primaryKey }), [
            decoratePropertyWith(meta => PrimaryKey({
                type: meta.type,
                onCreate: cuid
            }) as PropertyDecorator),
        ], [
            ifMetadata(
                isEnumField, [
                    decoratePropertyWith(meta => Enum({
                        array: isArrayField(meta),
                        nullable: meta.optional,
                        items: () => Object.values(innerType(meta.type))
                    }) as PropertyDecorator),
                ], [
                    decoratePropertyWith((meta, { propertyKey }) => Property({
                        type: meta.type,
                        nullable: meta.optional,
                        // @ts-expect-error unique only exists on scalar fields, but Property() doesn't care
                        unique: meta.unique,
                        onCreate: meta.default,
                        onUpdate: propertyKey === 'updatedAt'
                            ? () => new Date()
                            : undefined
                    }) as PropertyDecorator)
                ]
            )
        ]
    ),
];


export const entityClassActions: MetadataAction<ClassMetadata, ClassContext>[] = [
    ifMetadata(
        matchesMetadata({ entity }),
        [
            applyActionsToPropertyMetadata(entityPropertyActions),
            decorateClassWith(meta => Entity({
                comment: meta.description,
                schema: meta.schema,
                abstract: meta.abstract
            }))
        ]
    )
]