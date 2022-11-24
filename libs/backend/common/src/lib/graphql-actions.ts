import { applyActionsToPropertyMetadata, ClassContext, ClassMetadata, ClassPropertyContext, decorateClassWith, decoratePropertyWith, Float, Id, innerTypeMatches, Int, isObjectType, ObjectType, PropertyMetadata } from "@garrettmk/class-schema";
import { ifMetadata, MetadataAction } from "@garrettmk/metadata-actions";
import { Constructor } from '@garrettmk/ts-utils';
import { Field, InputType as GqlInputType, ObjectType as GqlObjectType, ReturnTypeFunc } from '@nestjs/graphql';
import { toGraphQlType } from './util/to-graphql-type.util';


export const graphqlPropertyActions: MetadataAction<PropertyMetadata, ClassPropertyContext>[] = [
    ifMetadata(innerTypeMatches<Constructor>(Int, Float, Id), [
        decoratePropertyWith(meta => 
            Field(toGraphQlType(meta.type), {
                nullable: meta.optional,
                description: meta.description,
            })
        )
    ], [
        decoratePropertyWith(meta => 
            Field(meta.type as ReturnTypeFunc, {
                nullable: meta.optional,
                description: meta.description
            })
        )
    ])
];


export const graphqlClassActions: MetadataAction<ClassMetadata, ClassContext>[] = [
    ifMetadata(isObjectType(ObjectType.InputType, ObjectType.ObjectType), [
        applyActionsToPropertyMetadata(graphqlPropertyActions)
    ]),

    ifMetadata(isObjectType(ObjectType.InputType), [
        decorateClassWith(meta => GqlObjectType({
            description: meta.description,
        })),
    ]),

    ifMetadata(isObjectType(ObjectType.ObjectType), [
        decorateClassWith(meta => GqlInputType({
            description: meta.description,
        }))
    ])
]