import { Button, ButtonProps } from "./button";
import { NoSymbolIcon } from 'heroicons-qwik/20/solid';
import clsx from "clsx";

export const CancelButton = ({ children, ...props }: ButtonProps) => (
    <Button {...props}>
        <NoSymbolIcon class={clsx("w-5 h-5", {
            'mr-1': !!children
        })}/>
        {children}
    </Button>
);