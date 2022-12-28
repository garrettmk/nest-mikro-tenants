import { HTMLAttributes } from "@builder.io/qwik";
import { TenantStatus } from "@nest-mikro-tenants/core/domain";
import { FormSelectInput, FormTextInput } from "@nest-mikro-tenants/frontend/qwik-ui";
import clsx from "clsx";

export type TenantCreateFormProps = HTMLAttributes<HTMLFormElement>;

export const TenantCreateForm = (props: TenantCreateFormProps) => {
    const { class: classNames, ...formProps } = props;

    return (
        <form
            preventdefault:submit
            preventdefault:change
            class={clsx("flex flex-wrap text-sm", classNames)}
            {...formProps}
        >
            <FormTextInput
                class="basis-1/2 pr-4 mb-4"
                name="name"
                label="Tenant name:"
            />
            <FormTextInput
                class="basis-1/2 mb-4"
                name="slug"
                label="Slug:"
            />
            <FormSelectInput
                class="basis-1/2 pr-4"
                name="status"
                label="Status"
                options={Object.values(TenantStatus)}
            />
        </form>
    );
};