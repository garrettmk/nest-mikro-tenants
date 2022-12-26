import { Email, and, ClassContext, ClassMetadata, ClassMetadataManager, decorateClassWith, decoratePropertyWith, Float, getTypeInfo, hidden, Id, input, Int, not, or, output, PropertyMetadata, TypeFn, withPropertiesMetadata, isEnumField } from "@garrettmk/class-schema";
import { always, applyToProperties, breakAction, ifMetadata, matchesMetadata, MetadataActionSet, MetadataSelector, MetadataTypeGuard, option, PropertyContext } from "@garrettmk/metadata-actions";
import { Constructor } from '@garrettmk/ts-utils';
import { UserStatus } from "@nest-mikro-tenants/core/domain";
import { Field, Float as GqlFloat, ID as GqlId, InputType as GqlInputType, Int as GqlInt, ObjectType as GqlObjectType, registerEnumType, ReturnTypeFunc, ReturnTypeFuncValue } from '@nestjs/graphql';

registerEnumType(UserStatus, {
    name: 'UserStatus',
});

/**
 * Map our types to GraphQL types
 */
const gqlTypeMap = new Map<Constructor, ReturnTypeFuncValue>([
    [Id, GqlId],
    [Int, GqlInt],
    [Float, GqlFloat],
    [RegExp, String],
    [Email, String]
]);

/**
 * Selector for fields that need to use a mapped type.
 */
const isMappedType: MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Constructor>, ClassContext & PropertyContext> = ((meta, context) => {
    const { innerType } = getTypeInfo(meta.type);
    return gqlTypeMap.has(innerType as Constructor);
}) as MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Constructor>>

/**
 * 
 * @param type A `TypeFn` to use as a template
 * @returns A `TypeFn` for a mapped GraphQL type
 */
const toGraphQlType = (type: TypeFn<Constructor>) => {
    const { innerType, isArray } = getTypeInfo(type);
    const gqlType = gqlTypeMap.get(innerType);

    if (!gqlType)
        throw new Error(`No GraphQL type mapping for ${innerType}`);

    return isArray
        ? () => [gqlType]
        : () => gqlType;
}

/**
 * A
 */
export const GraphQLActions = new MetadataActionSet<ClassMetadata, Constructor>(ClassMetadataManager, [
    ifMetadata(
        and(
            or(
                matchesMetadata({ input }),
                matchesMetadata({ output })
            ),
            not(
                matchesMetadata({ hidden })
            )
        ) as MetadataSelector<ClassMetadata, ClassContext>,
        [
            withPropertiesMetadata([
                applyToProperties([
                    option(matchesMetadata({ hidden }), [
                        breakAction
                    ]),
                    
                    option(isMappedType, [
                        decoratePropertyWith(meta => 
                            Field(toGraphQlType(meta.type), {
                                nullable: meta.optional,
                                description: meta.description
                            })
                        )
                    ]),

                    option(always, [
                        decoratePropertyWith(meta => 
                            Field(meta.type as ReturnTypeFunc, {
                                nullable: meta.optional,
                                description: meta.description
                            })
                        )
                    ])
                ])
            ]),

            ifMetadata(
                matchesMetadata({ output }),
                decorateClassWith(meta => GqlObjectType({
                    description: meta.description,
                    isAbstract: meta.abstract
                })),
                decorateClassWith(meta => GqlInputType({
                    description: meta.description,
                    isAbstract: meta.abstract
                }))
            ),
        ]
    )
]);