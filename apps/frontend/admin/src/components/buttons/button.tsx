import { JSXChildren, QRL, PropFunction, QwikMouseEvent } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import clsx from "clsx";

export type ButtonProps = {
    id?: string
    class?: string
    href?: string
    onClick$?: QRL<(event: QwikMouseEvent<HTMLElement, MouseEvent>) => void>
    disabled?: boolean
    children?: JSXChildren
    tooltip?: string
}

export const Button = (props: ButtonProps) => {
    const { class: classNames, ...otherProps } = props;

    const styles = clsx(
        `p-2 text-xs uppercase tracking-wide flex items-center
        rounded-md border-2 border-slate-300
        bg-slate-300 [&:not([disabled=""])]:hover:bg-slate-200 [&:not([disabled=""])]:active:bg-slate-100
        disabled:opacity-50
        focus:ring-2 ring-blue-300 outline-none`, 
        classNames
    );

    const ButtonElement = props.href ? Link : 'button';

    return (
        <ButtonElement
            class={styles}
            {...otherProps}
        />
    );
};