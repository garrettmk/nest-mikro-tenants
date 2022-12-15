import { HTMLAttributes } from "@builder.io/qwik";
import clsx from "clsx";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = (props: CardHeaderProps) => {
    const { class: className, ...divProps } = props;

    return (
        <header 
            class={clsx('flex items-center bg-slate-200 -mx-4 -mt-4 mb-4 px-4 py-2', className)}
            {...divProps}
        />
    );
}