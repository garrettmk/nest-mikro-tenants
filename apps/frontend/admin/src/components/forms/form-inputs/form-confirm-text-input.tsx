import { component$, useContext } from "@builder.io/qwik";
import { FormStateContext } from "../../../contexts/form-state.context";
import { TextInput, TextInputProps } from "../../inputs/text-input";

export interface FormConfirmTextInputProps extends Omit<TextInputProps, 'value' | 'errors' | 'onChange$'> {
    confirmsName?: string
}

export const FormConfirmTextInput = component$((props: FormConfirmTextInputProps) => {
    const { confirmsName, ...textInputProps } = props;
    
    const state = useContext(FormStateContext);
    
    const value = props.name 
        ? state.formData[props.name] as string
        : undefined;

    const errors = props.name && state.modified[props.name]
        ? state.errors[props.name]
        : undefined;

    return (
        <TextInput
            {...props}
            value={value}
            errors={errors}
            onChange$={async event => {
                if (props.name)
                    state.formData[props.name] = event.target.value
            }}
        />
    );
});

export default FormConfirmTextInput;