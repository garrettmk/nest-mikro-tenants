import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { CreateInput } from "@nest-mikro-tenants/core/factories";
import { gql } from "@urql/core";
import { propertiesFragment } from "./properties.fragment";

export function createOneMutation<T extends BaseModel>(target: Constructor<T>, createInput: Constructor<CreateInput<T>>) {
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