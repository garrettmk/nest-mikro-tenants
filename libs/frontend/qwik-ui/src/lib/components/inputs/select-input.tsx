import { HTMLAttributes } from "@builder.io/qwik"

export interface SelectInputProps extends HTMLAttributes<HTMLSelectElement> {
    label?: string
    name?: string
    errors?: string[]
}

export const SelectInput = (props: SelectInputProps) => {
    const { class: classNames, label, name, errors, ...selectProps } = props;

    return (
        <div class={classNames}>
            <label 
                class="block text-sm text-gray-600 mb-1"
                for={name}
            >
                {label}
            </label>
            <select
                class="block w-full rounded-sm p-1 focus:ring-2 ring-blue-300 outline-none bg-white" 
                name={name}
                {...selectProps}
            />
            {errors?.map(error => (
                <label class="block text-xs text-red-500 mt-1">
                    {error}
                </label>
            ))}
        </div>
    );
};