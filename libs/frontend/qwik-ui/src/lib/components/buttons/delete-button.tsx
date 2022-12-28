import { Button, ButtonProps } from "./button";
import { TrashIcon } from 'heroicons-qwik/20/solid';
import clsx from "clsx";

export const DeleteButton = ({ children, ...props }: ButtonProps) => (
    <Button color='red' {...props}>
        <TrashIcon class={clsx("w-5 h-5", {
            'mr-1': !!children
        })}/>
        {children}
    </Button>
);