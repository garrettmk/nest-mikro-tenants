import { CheckIcon } from "heroicons-qwik/20/solid";
import { Button, ButtonProps } from "./button";

export const SaveButton = (props: ButtonProps) => {
    const { class: classNames, ...otherProps } = props;

    const styles = `
        bg-blue-500 [&:not([disabled=""])]:hover:bg-blue-400 [&:not([disabled=""])]:active:bg-blue-300
    `;

    return (
        <Button class={styles} {...otherProps}>
            <CheckIcon class="inline-block w-5 h-5 mr-1"/>
            Save
        </Button>
    );
}