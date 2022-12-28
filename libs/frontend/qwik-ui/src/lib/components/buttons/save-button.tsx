import { Button, ButtonProps } from "./button";
import { CheckIcon } from 'heroicons-qwik/20/solid';
import clsx from "clsx";

export const SaveButton = ({ children, ...props }: ButtonProps) => (
    <Button color='blue' {...props}>
        <CheckIcon class={clsx("w-5 h-5", {
            'mr-1': !!children
        })}/>
        {children}
    </Button>
);