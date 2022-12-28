import { useStore } from "@builder.io/qwik"

export interface FormState<T extends object = any> {
    initialData?: Partial<T>
    formData: Record<string, unknown>
    modified: Record<string, boolean>
    errors: Record<string, string[]>
    isValid: boolean
    isModified: boolean
    result: T | undefined
}

export function useFormState<T extends object = any>(initialData?: Partial<T> | (() => Partial<T>)): FormState<T> {
    return useStore<FormState<T>>(() => {
        const initialDataValues = typeof initialData === 'function'
            ? initialData()
            : initialData;

        return {
            initialData: initialDataValues,
            formData: { ...initialDataValues },
            modified: {},
            errors: {},
            isValid: false,
            isModified: false,
            result: undefined
        };
    }, {
        recursive: true
    });
}