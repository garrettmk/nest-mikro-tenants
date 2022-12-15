import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { DataFields } from "@nest-mikro-tenants/core/common";
import { User } from "@nest-mikro-tenants/core/domain";
import { WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { gql, TypedDocumentNode } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export type DeleteOneMutationVariables<T extends BaseModel, W extends WhereOneInput<T>> = {
    where: W
}

export function deleteOneMutation<
    T extends BaseModel, 
    W extends WhereOneInput<T>
>(
    target: Constructor<T>, 
    whereInput: Constructor<W>
) : TypedDocumentNode<DataFields<User>, DeleteOneMutationVariables<T, W>> {
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