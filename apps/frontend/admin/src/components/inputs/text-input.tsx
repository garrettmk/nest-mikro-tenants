import { PropFunction, QwikChangeEvent } from "@builder.io/qwik"
import clsx from "clsx"

export interface TextInputProps {
    class?: string
    label?: string
    name?: string
    password?: boolean
    required?: boolean
    value?: string
    onChange$?: PropFunction<(event: QwikChangeEvent<HTMLInputElement>) => unknown>
    errors?: string[]
}

export const TextInput = (props: TextInputProps) => {
    return (
        <div class={clsx(props.class)}>
            <label 
                class="block text-sm text-gray-600 mb-1"
                for={props.name}
            >
                {props.label}
            </label>
            <input 
                class="block w-full rounded-sm p-1 focus:ring-2 ring-blue-300 outline-none" 
                type={props.password ? "password" : "text"}
                name={props.name}
                value={props.value}
                onChange$={props.onChange$}
            />
            {props.errors?.map(error => (
                <label class="block text-xs text-red-500 mt-1">
                    {error}
                </label>
            ))}
        </div>
    )
};