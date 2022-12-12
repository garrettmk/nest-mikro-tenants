import { component$, Slot } from "@builder.io/qwik";
import clsx from "clsx";

export interface CollapseProps {
    class?: string
    open?: boolean
}

export const Collapse = component$((props: CollapseProps) => (
    <div class={clsx("overflow-hidden transition-[height] ease-linear duration-300", {
        'h-0': !props.open,
        'h-fit': props.open
    }, props.class)}>
        <Slot/>
    </div>
));