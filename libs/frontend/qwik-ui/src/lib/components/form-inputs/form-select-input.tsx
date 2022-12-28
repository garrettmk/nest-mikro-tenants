import { $, component$, QwikChangeEvent, useContext } from "@builder.io/qwik";
import { capitalize } from "radash";
import { FormStateContext } from "../../contexts/form-state.context";
import { SelectInput, SelectInputProps } from "../inputs/select-input";

export type FormSelectInputProps = Omit<SelectInputProps, 'value' | 'errors' | 'onChange$'> & {
    options?: (string | { value: string, label: string})[]
};

export const FormSelectInput = component$((props: FormSelectInputProps) => {
    const { name, options = [] } = props;
    const state = useContext(FormStateContext);
    
    const formValue = name 
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
            errors={errors}
            onChange$={handleChange$}
        >
            {options.map(option => typeof option === 'string' 
                    ? { value: option, label: capitalize(option) }
                    : option
            ).map(({ value, label }) => (
                <option
                    key={value}
                    value={value}
                    selected={value === formValue}
                >
                    {label}
                </option>
            ))}
        </SelectInput>
    );
});

export default FormSelectInput;