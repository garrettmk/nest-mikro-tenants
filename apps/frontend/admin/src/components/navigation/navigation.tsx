import { component$ } from "@builder.io/qwik";
import clsx from 'clsx';
import { ChartPieIcon, HomeIcon, UserIcon } from 'heroicons-qwik/24/outline';
import { NavButton } from "./nav-button";

export interface NavigationProps {
    class?: string
}

export const Navigation = component$((props: NavigationProps) => {
    const { class: classNames } = props;

    return (
        <nav class={clsx('dark:text-white p3', classNames)}>
            <header class="h-16">
                
            </header>
            <NavButton href="/" exact>
                <ChartPieIcon q:slot='icon'/>
                Dashboard
            </NavButton>
            <NavButton href="/users">
                <UserIcon q:slot='icon'/>
                Users
            </NavButton>
            <NavButton href='/tenants'>
                <HomeIcon q:slot='icon'/>
                Tenants
            </NavButton>
        </nav>
    );
});

