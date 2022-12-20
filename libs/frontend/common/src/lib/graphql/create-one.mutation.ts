import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { CreateInput } from "@nest-mikro-tenants/core/factories";
import { gql, TypedDocumentNode } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export type CreateOneVariables<T extends BaseModel, C extends CreateInput<T>> = {
    input: C
}

export type CreateOneData<T extends BaseModel, N extends string, K extends string = `updateOne${N}`> = {
    [k in K]: T
}

export function createOneMutation<
    T extends BaseModel,
    C extends CreateInput<T>,
    N extends string
>(
    target: Constructor<T>,
    createInput: Constructor<C>,
    name?: N
): TypedDocumentNode<CreateOneData<T, N>, CreateOneVariables<T, C>> {
    const fragmentName = `${target.name}Fields`;
    const fragment = propertiesFragment(target, fragmentName);

    return gql`
        mutation CreateOne${target.name}($input: ${createInput.name}!) {
            createOne${target.name}(input: $input) {
                ...${fragmentName}
            }
        }

        ${fragment}
    `
}