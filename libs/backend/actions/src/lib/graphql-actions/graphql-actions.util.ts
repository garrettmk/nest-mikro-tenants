import { PropertyMetadata, TypeFn, getTypeInfo, Email, Float, Id, Int } from '@garrettmk/class-schema';
import { Constructor, isConstructor } from '@garrettmk/ts-utils';
import { Float as GqlFloat, ID as GqlId, Int as GqlInt, ReturnTypeFuncValue } from '@nestjs/graphql';

/** Mapped types */
const mappedTypes = new Map<Constructor, ReturnTypeFuncValue>([
  [Id, GqlId],
  [Int, GqlInt],
  [Float, GqlFloat],
  [RegExp, String],
  [Email, String],
]);

/** MetadataTypeGuard, selects metadata whose innerType is a mapped type */
export function isMappedTypeField(meta: PropertyMetadata): meta is PropertyMetadata<Constructor> {
  const { innerType } = getTypeInfo(meta.type);
  return isConstructor(innerType) && mappedTypes.has(innerType);
}

/** Convert a TypeFn to use a mapped type */
export function toGraphQlType(type: TypeFn<Constructor>): TypeFn<ReturnTypeFuncValue> {
  const { innerType, isArray } = getTypeInfo(type);
  const mappedType = mappedTypes.get(innerType);

  if (!mappedType) throw new Error(`No GraphQL type mapping for ${innerType}`);

  return isArray ? () => [mappedType] : () => mappedType;
}
