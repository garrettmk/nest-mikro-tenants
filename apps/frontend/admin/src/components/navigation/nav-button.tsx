import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import clsx from 'clsx';

export interface NavButtonProps {
    href: string
    exact?: boolean
}

export const NavButton = component$((props: NavButtonProps) => {
    const { href, exact } = props;
    const location = useLocation();
    
    const active = exact 
        ? location.pathname === href 
        : location.pathname.startsWith(href);

    const buttonStyles = clsx(`
        w-full px-3 py-2
        grid grid-rows-1 grid-cols-[32px_1fr] gap-x-3 items-center
        dark:text-white
    `, {
        ['dark:bg-slate-700']: active,
        ['hover:bg-slate-800']: !active
    });

    const textStyles = clsx('text-lg', {
        'font-bold': active
    });

    return (
        <Link class={buttonStyles} href={href}>
            <Slot name='icon'/>
            <span class={textStyles}>
                <Slot/>
            </span>
        </Link>
    );
});

export default NavButton;