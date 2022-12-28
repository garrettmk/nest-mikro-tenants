import { HTMLAttributes } from "@builder.io/qwik";
import clsx from "clsx";

export type ToolbarProps = HTMLAttributes<HTMLDivElement>;

export const Toolbar = ((props: ToolbarProps) => {
    const { class: classNames, ...divProps } = props;

    return (
        <div 
            class={clsx(`flex items-center [&>:not(:last-child)]:mr-2`, classNames)}
            {...divProps}
        />
    );
});