import { Float, getTypeInfo, Id, Int, TypeFn } from '@garrettmk/class-schema';
import { Constructor, MaybeArray } from '@garrettmk/ts-utils';
import { Float as GqlFloat, ID as GqlId, Int as GqlInt } from '@nestjs/graphql';


export function toGraphQlType(typeFn: TypeFn<MaybeArray<Constructor>>) {
    const { innerType, isArray } = getTypeInfo(typeFn);

    const gqlType = () => {
        switch (innerType) {
            case Int: return GqlInt;
            case Float: return GqlFloat;
            case Id: return GqlId;
            case RegExp: return String;
            default: throw new Error(`No mapped type for ${innerType}`);
        }
    };

    if (isArray)
        return () => [gqlType()];
    else
        return () => gqlType();
}
