import {
  and,
  ClassContext,
  ClassMetadata,
  ClassMetadataManager,
  decorateClassWith,
  decoratePropertyWith,
  hidden,
  input,
  not,
  or,
  output,
  withPropertiesMetadata,
} from '@garrettmk/class-schema';
import {
  always,
  applyToProperties,
  breakAction,
  ifMetadata,
  matchesMetadata,
  MetadataActionSetClass,
  MetadataSelector,
  option,
} from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import { TenantStatus, UserStatus } from '@nest-mikro-tenants/core/domain';
import {
  Field,
  InputType as GqlInputType,
  ObjectType as GqlObjectType,
  registerEnumType,
  ReturnTypeFunc,
} from '@nestjs/graphql';
import { isMappedTypeField, toGraphQlType } from './graphql-actions.util';

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(TenantStatus, {
  name: 'TenantStatus',
});

export class GraphQLActions extends MetadataActionSetClass<ClassMetadata, Constructor>() {
  static manager = ClassMetadataManager;
  static actions = [
    /** Process targets that are marked as inputs or outputs, and are not hidden */
    ifMetadata(
      and(
        or(matchesMetadata({ input }), matchesMetadata({ output })),
        not(matchesMetadata({ hidden }))
      ) as MetadataSelector<ClassMetadata, ClassContext>,
      [
        withPropertiesMetadata([
          applyToProperties([
            /** Ignore hidden fields */
            option(matchesMetadata({ hidden }), [breakAction]),

            /** If the field's type has a mapping, substitute the mapped type */
            option(isMappedTypeField, [
              decoratePropertyWith((meta) =>
                Field(toGraphQlType(meta.type), {
                  nullable: meta.optional,
                  description: meta.description,
                })
              ),
            ]),

            /** For every other type, just use it as-is */
            option(always, [
              decoratePropertyWith((meta) =>
                Field(meta.type as ReturnTypeFunc, {
                  nullable: meta.optional,
                  description: meta.description,
                })
              ),
            ]),
          ]),
        ]),

        /** Tell the GraphQL system what type of object this is */
        ifMetadata(
          matchesMetadata({ output }),
          decorateClassWith((meta) =>
            GqlObjectType({
              description: meta.description,
              isAbstract: meta.abstract,
            })
          ),
          decorateClassWith((meta) =>
            GqlInputType({
              description: meta.description,
              isAbstract: meta.abstract,
            })
          )
        ),
      ]
    ),
  ];
}
