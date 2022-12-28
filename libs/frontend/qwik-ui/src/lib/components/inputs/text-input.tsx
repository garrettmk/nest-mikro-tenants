import { HTMLAttributes } from "@builder.io/qwik"

export interface TextInputProps extends HTMLAttributes<HTMLInputElement> {
    class?: string
    label?: string
    name?: string
    value?: string
    password?: boolean
    required?: boolean
    errors?: string[]
}

export const TextInput = (props: TextInputProps) => {
    const { class: classNames, label, name, errors, password, ...inputProps } = props;

    return (
        <div class={classNames}>
            <label 
                class="block text-sm text-gray-600 mb-1"
                for={name}
            >
                {label}
            </label>
            <input 
                class="block w-full rounded-sm p-1 focus:ring-2 ring-blue-300 outline-none" 
                type={password ? "password" : "text"}
                name={name}
                {...inputProps}
            />
            {errors?.map(error => (
                <label class="block text-xs text-red-500 mt-1">
                    {error}
                </label>
            ))}
        </div>
    )
};