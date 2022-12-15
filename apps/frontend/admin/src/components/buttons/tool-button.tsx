import { JSXChildren, QRL, QwikMouseEvent, Signal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import clsx from "clsx";

export type ToolButtonProps = {
    ref?: Signal<HTMLElement | undefined>
    id?: string
    class?: string
    href?: string
    onClick$?: QRL<(event: QwikMouseEvent<HTMLButtonElement, MouseEvent>) => void>
    disabled?: boolean
    children?: JSXChildren
}

export const ToolButton = (props: ToolButtonProps) => {
    const styles = clsx(`
        p-1 text-xs uppercase tracking-wide flex items-center
        rounded-sm border-2 border-slate-300
        bg-slate-300 active:bg-slate-100
        focus:ring-2 ring-blue-300 outline-none
    `, {
        'opacity-50': props.disabled,
        'hover:bg-slate-200': !props.disabled
    }, props.class);

    const maybeRefProp = props.ref ? { ref: props.ref } : {};

    return (
        <>
            {props.href ? (
                <Link {...maybeRefProp} href={props.disabled ? undefined : props.href} class={styles}>
                    {props.children}
                </Link>
            ) : (
                <button {...maybeRefProp} class={styles} onClick$={props.onClick$} disabled={props.disabled}>
                    {props.children}
                </button>
            )}
        </>
    );
};