import { XMarkIcon } from "heroicons-qwik/20/solid";
import { Button, ButtonProps } from "./button";

export const CloseButton = (props: ButtonProps) => {
    const { class: classProp, ...otherProps } = props;

    const classNames = `
        p-0 bg-transparent [&:not([disabled=""])]:hover:bg-transparent [&:not([disabled=""])]:active:bg-transparent
        border-transparent
        ${classProp}
    `;

    return (
        <Button class={classNames} {...otherProps}>
            <XMarkIcon class="inline-block w-8 h-8 mr-1"/>
        </Button>
    );
}