import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { gql, TypedDocumentNode } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export type GetVariables = {
    id: string;
}

export type GetData<T extends BaseModel, N extends string, K extends string = `get${N}`> = {
    [k in K]: T
}

export function getQuery<
    T extends BaseModel,
    N extends string,
>(
    target: Constructor<T>,
    name?: N
): TypedDocumentNode<
    GetData<T, N>,
    GetVariables
> {
    const fragmentName = `${target.name}Fields`;
    const fragment = propertiesFragment(target, fragmentName);

    return gql`
        query Get${target.name}($id: ID!) {
            get${target.name}(id: $id) {
                ...${fragmentName}
            }
        }

        ${fragment}
    `;
}