import { HTMLAttributes } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import clsx from "clsx";

export type ButtonProps = HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & {
    href?: string
    disabled?: boolean
    tooltip?: string
    color?: 'gray' | 'blue' | 'blue' | 'green' | 'red'
    variant?: 'bordered' | 'solid'
    size?: 'sm' | 'md'
}

const baseButtonStyles = `
    border-2
    inline-flex items-center
    text-xs uppercase tracking-wide
    disabled:opacity-50
    focus:ring-2 ring-blue-300 outline-none
`;

const sizeStyles = {
    sm: `rounded-sm p-1`,
    md: `rounded-md p-2`
};

const borderStyles = {
    gray: `
        border-slate-200
        [&:not([disabled=""])]:hover:border-slate-100
        [&:not([disabled=""])]:active:border-slate-50
    `,

    blue: `
        border-blue-500
        [&:not([disabled=""])]:hover:border-blue-400
        [&:not([disabled=""])]:active:border-blue-300
    `,
    
    green: `
        border-green-500
        [&:not([disabled=""])]:hover:border-green-400
        [&:not([disabled=""])]:active:border-green-300
    `,

    red: `
        border-red-500
        [&:not([disabled=""])]:hover:border-red-400
        [&:not([disabled=""])]:active:border-red-300
    `
};

const textStyles = {
    gray: `
        text-black
        [&:not([disabled=""])]:hover:text-gray-600
        [&:not([disabled=""])]:active:text-gray-500
    `,

    blue: `
        text-blue-500
        [&:not([disabled=""])]:hover:text-blue-400
        [&:not([disabled=""])]:active:text-blue-300
    `,

    green: `
        text-green-500
        [&:not([disabled=""])]:hover:text-green-400
        [&:not([disabled=""])]:active:text-green-300
    `,
    red: `
        text-red-500
        [&:not([disabled=""])]:hover:text-red-400
        [&:not([disabled=""])]:active:text-red-300
    `
}

const backgroundStyles = {
    gray: `
        bg-slate-200
        [&:not([disabled=""])]:hover:bg-slate-100
        [&:not([disabled=""])]:active:bg-slate-50
    `,

    blue: `
        bg-blue-500
        [&:not([disabled=""])]:hover:bg-blue-400
        [&:not([disabled=""])]:active:bg-blue-300
    `,

    green: `
        bg-green-500
        [&:not([disabled=""])]:hover:bg-green-400
        [&:not([disabled=""])]:active:bg-green-300
    `,

    red: `
        bg-red-500
        [&:not([disabled=""])]:hover:bg-red-400
        [&:not([disabled=""])]:active:bg-red-300
    `
};


export const Button = (props: ButtonProps) => {
    const {
        className,
        color = 'gray',
        variant = 'solid',
        size = 'md',
        ...otherProps
    } = props;

    const styles = clsx(
        baseButtonStyles, 
        borderStyles[color],
        sizeStyles[size],
        {
            ['text-black']: variant === 'solid' && color === 'gray',
            ['text-white']: variant === 'solid' && color !== 'gray',
            [textStyles[color]]: variant === 'bordered',
            [backgroundStyles[color]]: variant === 'solid'
        }, 
        className
    );

    const ButtonElement = props.href ? Link : 'button';

    return (
        <ButtonElement
            class={styles}
            {...otherProps}
        />
    );
};