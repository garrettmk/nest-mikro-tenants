import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { Pagination, WhereInput } from "@nest-mikro-tenants/core/factories";
import { gql, TypedDocumentNode } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export type FindManyVariables<T extends BaseModel,  W extends WhereInput<T>> = {
    where?: W
}

export type FindManyData<T extends BaseModel, N extends string = string, K extends string = `findMany${N}s`> = {
    [k in K]: {
        pagination: Pagination
        items: T[]
    }
}

export function findManyQuery<
    T extends BaseModel,
    W extends WhereInput<T>,
    N extends string
>(
    target: Constructor<T>, 
    whereInput: Constructor<W>,
    name?: N
): TypedDocumentNode<FindManyData<T, N>, FindManyVariables<T, W>> {
    const fragmentName = `${target.name}Fields`;
    const fragment = propertiesFragment(target, fragmentName);

    return gql`
        query FindMany${target.name}s($where: ${whereInput.name}) {
            findMany${target.name}s(where: $where) {
                pagination {
                    offset
                    limit
                    total
                }
                items {
                    ...${fragmentName}
                }
            }
        }

        ${fragment}
    `;
}