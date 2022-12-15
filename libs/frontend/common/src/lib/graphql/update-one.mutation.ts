import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { gql, TypedDocumentNode } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export type UpdateOneVariables<T extends BaseModel, W extends WhereInput<T>, U extends UpdateInput<T>> = {
    where: W
    update: U
}

export type UpdateOneResult<T extends BaseModel, N extends string, K extends string = `updateOne${N}`> = {
    [k in K]: T
}

export function updateOneMutation<
    T extends BaseModel,
    N extends string,
    W extends WhereOneInput<T>, 
    U extends UpdateInput<T>
>(
    target: Constructor<T>,
    targetName: N,
    whereOneInput: Constructor<W>,
    updateInput: Constructor<U>
): TypedDocumentNode<
    UpdateOneResult<T, N>,
    UpdateOneVariables<T, W, U>
> {

    const fragmentName = `${target.name}Fields`;
    const fragment = propertiesFragment(target, fragmentName);

    return gql`
        mutation UpdateOne${target.name}($where: ${whereOneInput.name}!, $update: ${updateInput.name}!) {
            updateOne${target.name}(where: $where, update: $update) {
                ...${fragmentName}
            }
        }

        ${fragment}
    `;;
}