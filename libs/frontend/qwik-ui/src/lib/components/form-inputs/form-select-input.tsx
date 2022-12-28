import { $, component$, QwikChangeEvent, useContext } from "@builder.io/qwik";
import { FormStateContext } from "../../contexts/form-state.context";
import { SelectInput, SelectInputProps } from "../inputs/select-input";

export type FormSelectInputProps = Omit<SelectInputProps, 'value' | 'errors' | 'onChange$'>;

export const FormSelectInput = component$((props: FormSelectInputProps) => {
    const { name } = props;
    const state = useContext(FormStateContext);
    
    const value = name 
        ? state.formData[name] as string
        : undefined;

    const errors = name && state.modified[name]
        ? state.errors[name]
        : undefined;

    const handleChange$ = $((event: QwikChangeEvent<HTMLSelectElement>) => {
        if (name)
            state.formData[name] = event.target.value;
    });

    return (
        <SelectInput
            {...props}
            name={name}
            value={value}
            errors={errors}
            onChange$={handleChange$}
        />
    );
});

export default FormSelectInput;