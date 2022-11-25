import { input, output, applyActionsToPropertyMetadata, ClassContext, ClassMetadata, ClassPropertyContext, decorateClassWith, decoratePropertyWith, Float, Id, innerTypeMatches, Int, or, PropertyMetadata } from "@garrettmk/class-schema";
import { ifMetadata, matchesMetadata, MetadataAction } from "@garrettmk/metadata-actions";
import { Constructor } from '@garrettmk/ts-utils';
import { Field, InputType as GqlInputType, ObjectType as GqlObjectType, ReturnTypeFunc } from '@nestjs/graphql';
import { toGraphQlType } from './util/to-graphql-type.util';


export const graphqlPropertyActions: MetadataAction<PropertyMetadata, ClassPropertyContext>[] = [
    ifMetadata(
        innerTypeMatches<Constructor>(Int, Float, Id), [
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
        ]
    )
];


export const graphqlClassActions: MetadataAction<ClassMetadata, ClassContext>[] = [
    ifMetadata(
        matchesMetadata({ output }), [
            applyActionsToPropertyMetadata(graphqlPropertyActions),
            decorateClassWith(meta => GqlObjectType({
                description: meta.description,
            })),
        ]
    ),

    ifMetadata(
        matchesMetadata({ input }), [
            applyActionsToPropertyMetadata(graphqlPropertyActions),
            decorateClassWith(meta => GqlInputType({
                description: meta.description,
            })),
        ]
    )
];