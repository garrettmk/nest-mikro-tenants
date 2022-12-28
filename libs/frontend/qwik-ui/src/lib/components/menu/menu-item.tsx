import { HTMLAttributes } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export type MenuItemProps = HTMLAttributes<Element> & {
    href?: string
};

export const MenuItem = (props: MenuItemProps) => {
    const { class: classNames, ...elementProps } = props;
    const MenuItemElement = 'href' in elementProps ? Link : 'button';

    return (
        <MenuItemElement
            class={`block w-full hover:bg-slate-100 p-4 text-left ${classNames}`}
            {...elementProps}
        />
    );
};