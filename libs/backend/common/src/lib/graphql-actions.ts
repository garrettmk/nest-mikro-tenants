import { and, ClassContext, ClassMetadata, ClassMetadataManager, decorateClassWith, decoratePropertyWith, Email, Float, getTypeInfo, hidden, Id, input, Int, not, or, output, PropertyMetadata, TypeFn, withPropertiesMetadata } from "@garrettmk/class-schema";
import { always, applyToProperties, breakAction, ifMetadata, matchesMetadata, MetadataActionSetClass, MetadataSelector, option } from "@garrettmk/metadata-actions";
import { Constructor, isConstructor } from '@garrettmk/ts-utils';
import { TenantStatus, UserStatus } from "@nest-mikro-tenants/core/domain";
import { Field, Float as GqlFloat, ID as GqlId, InputType as GqlInputType, Int as GqlInt, ObjectType as GqlObjectType, registerEnumType, ReturnTypeFunc, ReturnTypeFuncValue } from '@nestjs/graphql';

registerEnumType(UserStatus, {
    name: 'UserStatus',
});

registerEnumType(TenantStatus, {
    name: 'TenantStatus'
});


export class GraphQLActions extends MetadataActionSetClass<ClassMetadata, Constructor>() {
    static manager = ClassMetadataManager;

    /** Mapped types */
    static mappedTypes = new Map<Constructor, ReturnTypeFuncValue>([
        [Id, GqlId],
        [Int, GqlInt],
        [Float, GqlFloat],
        [RegExp, String],
        [Email, String]
    ]);

    /** MetadataTypeGuard, selects metadata whose innerType is a mapped type */
    static isMappedTypeField(meta: PropertyMetadata): meta is PropertyMetadata<Constructor> {
        const { innerType } = getTypeInfo(meta.type);
        return isConstructor(innerType) && GraphQLActions.mappedTypes.has(innerType);
    }

    /** Convert a TypeFn to use a mapped type */
    static toGraphQlType(type: TypeFn<Constructor>): TypeFn<ReturnTypeFuncValue> {
        const { innerType, isArray } = getTypeInfo(type);
        const mappedType = GraphQLActions.mappedTypes.get(innerType);

        if (!mappedType)
            throw new Error(`No GraphQL type mapping for ${innerType}`);

        return isArray
            ? () => [mappedType]
            : () => mappedType;
    }

    /** Actions */
    static actions = [
        /** Process targets that are marked as inputs or outputs, and are not hidden */
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
                        /** Ignore hidden fields */
                        option(matchesMetadata({ hidden }), [
                            breakAction
                        ]),
                        
                        /** If the field's type has a mapping, substitute the mapped type */
                        option(this.isMappedTypeField, [
                            decoratePropertyWith(meta => 
                                Field(this.toGraphQlType(meta.type), {
                                    nullable: meta.optional,
                                    description: meta.description
                                })
                            )
                        ]),
    
                        /** For every other type, just use it as-is */
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
    
                /** Tell the GraphQL system what type of object this is */
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
    ];
}
