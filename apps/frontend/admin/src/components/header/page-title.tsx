import { HTMLAttributes } from "@builder.io/qwik"
import clsx from "clsx";

export type PageTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const PageTitle = (props: PageTitleProps) => {
    const { class: className, ...headingProps } = props;

    return (
        <h1 class={clsx("text-2xl mr-auto", className)} {...headingProps}/>
    )
}