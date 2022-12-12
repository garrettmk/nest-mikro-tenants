import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { WhereInput } from "@nest-mikro-tenants/core/factories";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { propertiesFragment } from "./properties.fragment";


export function findManyQuery<T extends BaseModel>(target: Constructor<T>, whereInput: Constructor<WhereInput<T>>): DocumentNode {
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