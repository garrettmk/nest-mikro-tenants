import { $, component$, QwikChangeEvent, useContext } from "@builder.io/qwik";
import { FormStateContext } from "../../contexts/form-state.context";
import { TextInput, TextInputProps } from "../inputs/text-input";

export type FormTextInputProps = Omit<TextInputProps, 'value' | 'errors' | 'onChange$'>;

export const FormTextInput = component$((props: FormTextInputProps) => {
    const { name } = props;
    const state = useContext(FormStateContext);
    
    const value = name 
        ? state.formData[name] as string
        : undefined;

    const errors = name && state.modified[name]
        ? state.errors[name]
        : undefined;

    const handleChange$ = $((event: QwikChangeEvent<HTMLInputElement>) => {
        if (name)
            state.formData[name] = event.target.value;
    });

    return (
        <TextInput
            {...props}
            value={value}
            errors={errors}
            onChange$={handleChange$}
        />
    );
});

export default FormTextInput;