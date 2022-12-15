import { NoSymbolIcon } from "heroicons-qwik/20/solid";
import { Button, ButtonProps } from "./button";

export const CancelButton = (props: ButtonProps) => {
    const { class: className, ...otherProps } = props;

    const styles = `
        bg-transparent hover:bg-slate-100 active:bg-white
        border-transparent hover:border-slate-200
        ${className}
    `
    return (
        <Button class={styles} {...otherProps}>
            <NoSymbolIcon class="inline-block w-5 h-5 mr-1"/>
            Cancel
        </Button>
    );
}