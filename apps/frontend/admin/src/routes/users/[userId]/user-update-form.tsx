import { HTMLAttributes } from "@builder.io/qwik";
import clsx from "clsx";
import { FormTextInput, FormSelectInput } from "@nest-mikro-tenants/frontend/qwik-ui";
import { UserStatus } from "@nest-mikro-tenants/core/domain";

export type UserUpdateFormProps = HTMLAttributes<HTMLFormElement>;

export const UserUpdateForm = (props: UserUpdateFormProps) => {
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
                name="nickname"
                label="Nickname:"
            />
            <FormTextInput
                class="basis-1/2 mb-4"
                name="username"
                label="Username:"
            />
            <FormTextInput
                class="basis-1/2 pr-4 mb-4"
                name="email"
                label="Email:"
            />
            <FormTextInput
                class="basis-1/2 mb-4"
                name="password"
                label="Password"
                password
            />
            <FormSelectInput
                class="basis-1/2 pr-4"
                name="status"
                label="Status"
                options={Object.values(UserStatus)}
            />
            <FormTextInput
                class="basis-1/2"
                name="passwordAgain"
                label="Password (again)"
                password
            />
        </form>
    );
};