import { HTMLAttributes } from "@builder.io/qwik"
import clsx from "clsx";

export type MenuProps = HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg'
    fit?: boolean
};

const baseStyles = `
    bg-white overflow-auto shadow-xl border
`;

const sizeStyles = {
    sm: `rounded-sm w-32 text-xs`,
    md: `rounded-md w-48 text-sm`,
    lg: 'rounded-lg w-64 text-md'
};


export const Menu = (props: MenuProps) => {
    const { class: classNames, size = 'md', fit, ...divProps } = props;

    const styles = clsx(baseStyles, sizeStyles[size], classNames);

    return (
        <div
            class={styles}
            {...divProps}
        />
    );
}