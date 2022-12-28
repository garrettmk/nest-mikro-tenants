import { Button, ButtonProps } from "./button";
import { XMarkIcon } from 'heroicons-qwik/20/solid';
import clsx from "clsx";

export const CloseButton = ({ children, ...props }: ButtonProps) => (
    <Button {...props}>
        <XMarkIcon class={clsx("w-5 h-5", {
            'mr-1': !!children
        })}/>
        {children}
    </Button>
);