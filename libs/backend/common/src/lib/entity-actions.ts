import { ClassPropertyContext, PropertyMetadata, primaryKey, decoratePropertyWith, isEnumField, isArrayField, innerType, ClassMetadata, ClassContext, applyActionsToPropertyMetadata, entity, decorateClassWith } from "@garrettmk/class-schema";
import { ifMetadata, matchesMetadata, MetadataAction } from "@garrettmk/metadata-actions";
import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";


export const entityPropertyActions: MetadataAction<PropertyMetadata, ClassPropertyContext>[] = [
    ifMetadata(
        matchesMetadata({ primaryKey }), [
            decoratePropertyWith(meta => PrimaryKey({
                type: meta.type,
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
                    decoratePropertyWith(meta => Property({
                        type: meta.type,
                        nullable: meta.optional,
                        // @ts-expect-error unique only exists on scalar fields, but Property() doesn't care
                        unique: meta.unique
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
                comment: meta.description
            }))
        ]
    )
]