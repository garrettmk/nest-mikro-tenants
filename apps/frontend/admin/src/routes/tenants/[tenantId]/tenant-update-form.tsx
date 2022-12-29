import { HTMLAttributes } from "@builder.io/qwik";
import clsx from "clsx";
import { FormTextInput, FormSelectInput } from "@nest-mikro-tenants/frontend/qwik-ui";
import { TenantStatus } from "@nest-mikro-tenants/core/domain";

export type TenantUpdateFormProps = HTMLAttributes<HTMLFormElement>;

export const TenantUpdateForm = (props: TenantUpdateFormProps) => {
    const { class: className, ...formProps } = props;

    return (
        <form
            preventdefault:submit
            preventdefault:change 
            class={clsx("flex flex-wrap text-sm", className)}
            {...formProps}
        >
            <FormTextInput
                class="basis-1/2 pr-4 mb-4"
                name="name"
                label="Name:"
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