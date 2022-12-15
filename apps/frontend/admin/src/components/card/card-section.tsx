import { HTMLAttributes } from "@builder.io/qwik";
import clsx from "clsx";

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

export const CardSection = (props: CardSectionProps) => {
    const { class: classNames, ...divProps } = props;

    return (
        <section
            class={clsx('bg-slate-100 rounded-lg overflow-auto p-4', classNames)}
            {...divProps}
        />
    );
}