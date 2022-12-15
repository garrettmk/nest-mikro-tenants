import { PlusIcon } from "heroicons-qwik/20/solid";
import { Button, ButtonProps } from "./button";

export const CreateButton = (props: ButtonProps) => (
    <Button {...props}>
        <PlusIcon class="inline-block w-5 h-5 mr-1"/>
        Create
    </Button>
);