import { Button, ButtonProps } from "./button";
import { PlusIcon } from 'heroicons-qwik/20/solid';
import clsx from "clsx";

export const CreateButton = ({ children, ...props }: ButtonProps) => (
    <Button {...props}>
        <PlusIcon class={clsx("w-5 h-5", {
            'mr-1': !!children
        })}/>
        {children}
    </Button>
);