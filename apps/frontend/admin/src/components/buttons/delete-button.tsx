import { TrashIcon } from "heroicons-qwik/24/solid";
import { Button, ButtonProps } from "./button";

export const DeleteButton = (props: ButtonProps) => {
    const { class: classNames, ...buttonProps } = props;

    const styles = `
        bg-red-500 hover:bg-red-400 active:bg-red-300
        border-red-500
        text-white
        ${classNames}
    `;

    return (
        <Button class={styles} {...buttonProps}>
            <TrashIcon class="inline-block w-5 h-5 mr-1"/>
            Delete
        </Button>
    );
}