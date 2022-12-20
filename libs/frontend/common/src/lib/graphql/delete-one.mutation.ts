import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { gql, TypedDocumentNode } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export type DeleteOneVariables<T extends BaseModel, W extends WhereOneInput<T>> = {
    where: W
}

export type DeleteOneData<T extends BaseModel, N extends string, K extends string = `deleteOne${N}`> = {
    [k in K]: T
}

export function deleteOneMutation<
    T extends BaseModel, 
    W extends WhereOneInput<T>,
    N extends string
>(
    target: Constructor<T>, 
    whereInput: Constructor<W>,
    name?: N
) : TypedDocumentNode<DeleteOneData<T, N>, DeleteOneVariables<T, W>> {
    const fragmentName = `${target.name}Fields`;
    const fragment = propertiesFragment(target, fragmentName);

    return gql`
        mutation DeleteOne${target.name}($where: ${whereInput.name}!) {
            deleteOne${target.name}(where: $where) {
                ...${fragmentName}
            }
        }

        ${fragment}
    `
}