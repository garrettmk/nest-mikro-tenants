import { HTMLAttributes } from "@builder.io/qwik";
import clsx from "clsx";

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const CardTitle = (props: CardTitleProps) => {
    const { class: classNames, ...headingProps } = props;

    return (
        <h2
            class={clsx('text-sm uppercase tracking-wide', classNames)}
            {...headingProps}
        />
    );
};