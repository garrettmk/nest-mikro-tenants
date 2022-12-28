import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import clsx from 'clsx';
import { ChartPieIcon, HomeIcon, UserIcon, Cog6ToothIcon } from 'heroicons-qwik/24/outline';
import { NavButton } from "./nav-button";

export interface NavigationProps {
    class?: string
}

export const Navigation = component$((props: NavigationProps) => {
    const { class: classNames } = props;
    const location = useLocation();

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
            <NavButton href='/components'>
                <Cog6ToothIcon q:slot='icon'/>
                Components
            </NavButton>
            {location.pathname.startsWith('/components') && (
                <>
                    <NavButton href='/components/layout' level={2}>
                        <span q:slot='icon'/>
                        Layout
                    </NavButton>
                    <NavButton href='/components/buttons' level={2}>
                        <span q:slot='icon'/>
                        Buttons
                    </NavButton>
                    <NavButton href='/components/menus' level={2}>
                        <span q:slot='icon'/>
                        Menus
                    </NavButton>
                    <NavButton href='/components/inputs' level={2}>
                        <span q:slot='icon'/>
                        Inputs
                    </NavButton>
                </>
            )}
        </nav>
    );
});

