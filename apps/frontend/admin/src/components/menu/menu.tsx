import { HTMLAttributes } from "@builder.io/qwik"

export type MenuProps = HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg'
    fit?: boolean
};

export const Menu = (props: MenuProps) => {
    const { class: classNames, size = 'md', fit, ...divProps } = props;
    
    const rounded = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg'
    }[size];

    const width = fit ? '' : {
        sm: 'w-32',
        md: 'w-48',
        lg: 'w-64'
    }[size];

    const textSize = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-md'
    }[size];

    const menuClasses = `
        bg-white ${rounded} overflow-auto shadow-xl 
        ${width} ${textSize} normal-case
        ${classNames}
    `;

    return (
        <div
            class={menuClasses}
            {...divProps}
        />
    );
}