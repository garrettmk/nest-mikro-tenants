import { hidden, applyActionsToPropertyMetadata, ClassContext, ClassMetadata, ClassPropertyContext, decorateClassWith, decoratePropertyWith, Float, Id, innerTypeMatches, input, Int, output, PropertyMetadata, and, not } from "@garrettmk/class-schema";
import { ifMetadata, matchesMetadata, MetadataAction } from "@garrettmk/metadata-actions";
import { Constructor } from '@garrettmk/ts-utils';
import { Field, InputType as GqlInputType, ObjectType as GqlObjectType, ReturnTypeFunc, InterfaceType } from '@nestjs/graphql';
import { toGraphQlType } from './util/to-graphql-type.util';


export const graphqlPropertyActions: MetadataAction<PropertyMetadata, ClassPropertyContext>[] = [
    ifMetadata(
        not(matchesMetadata({ hidden })),
        [
            ifMetadata(
                innerTypeMatches<Constructor>(Int, Float, Id, RegExp), [
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
        ]
    )
];


export const graphqlClassActions: MetadataAction<ClassMetadata, ClassContext>[] = [
    ifMetadata(
        not(matchesMetadata({ hidden })),
        [
            ifMetadata(
                matchesMetadata({ output }),
                [
                    applyActionsToPropertyMetadata(graphqlPropertyActions),
                    decorateClassWith(meta => GqlObjectType({
                        description: meta.description,
                        isAbstract: meta.abstract
                    })),
                ]
            ),

            ifMetadata(
                matchesMetadata({ input }),
                [
                    applyActionsToPropertyMetadata(graphqlPropertyActions),
                    decorateClassWith(meta => GqlInputType({
                        description: meta.description,
                        isAbstract: meta.abstract
                    })),
                ]
            )
        ]
    )
];