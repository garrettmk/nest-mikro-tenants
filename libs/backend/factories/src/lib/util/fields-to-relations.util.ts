import { AutoPath } from "@mikro-orm/core/typings";
import { GraphQLResolveInfo } from "graphql";
import _fieldsToRelations from "graphql-fields-to-relations";


export type FieldsToRelationsOptions = {
    depth?: number;
    root?: string;
    excludeFields?: string[];
}

export function fieldsToRelations<T extends object>(info: GraphQLResolveInfo, options?: FieldsToRelationsOptions): AutoPath<T, string>[] {
    // @ts-expect-error mismatched graphql versions?
    return _fieldsToRelations(info, options);
}