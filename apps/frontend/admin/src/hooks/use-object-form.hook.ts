import { PropFunction, useWatch$ } from "@builder.io/qwik";
import { BaseObjectConstructor } from "@garrettmk/class-schema";
import type { FormState } from "./use-form-state.hook";
import { group, mapValues } from "radash";


export function useObjectForm<T extends object>(objectType$: PropFunction<() => BaseObjectConstructor<T>>, state: FormState<T>) {
    useWatch$(async ({ track }) => {
        track(() => ({ ...state.formData }));
        const objectType = await objectType$();

        // Figure out which fields have been modified
        for (const key in state.formData) {
            const dataValue = state.formData[key];
            const initialValue = state.initialData?.[key as keyof T];

            state.modified[key] = dataValue !== initialValue;
        }

        state.isModified = Object.values(state.modified).some(modified => modified);

        // Validate fields
        const validationErrors = objectType.validateSync(state.formData);
        
        // Convert from an array of ValidationErrors to an object of
        // string arrays
        state.errors = mapValues(
            group(validationErrors, error => error.property),
            (errors) => errors.flatMap(error => Object.values(error.constraints ?? {}))
        );

        state.isValid = Object.values(state.errors).every(errors => !errors?.length);

        // Set or clear the result
        state.result = state.isValid 
            ? state.formData as T
            : undefined;
    });
}