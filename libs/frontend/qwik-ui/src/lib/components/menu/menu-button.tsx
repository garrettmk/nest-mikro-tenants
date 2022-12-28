import { component$, Slot, useClientEffect$, useSignal } from "@builder.io/qwik";
import { EllipsisVerticalIcon } from 'heroicons-qwik/20/solid';
import { usePopper } from "../../hooks/use-popper.hook";
import { Button, ButtonProps } from "../buttons/button";
import { Menu, MenuProps } from "./menu";

export type MenuButtonProps = 
    & Omit<ButtonProps, 'href' | 'onClick$' | 'ref' | 'children'>
    & Pick<MenuProps, 'size' | 'fit'>;

export const MenuButton = component$((props: MenuButtonProps) => {
    const { size, fit, ...buttonProps } = props;
    const buttonRef = useSignal<HTMLElement>();
    const menuRef = useSignal<HTMLElement>();
    const { state, toggle$, hide$ } = usePopper(buttonRef, menuRef);

    useClientEffect$(({ track }) => {
        const isShowing = track(() => state.isShowing);

        if (isShowing) {
            const handler = (event: MouseEvent) => {
                if (event.target !== menuRef.value)
                    hide$();
            };

            document.addEventListener('click', handler);
            return () => document.removeEventListener('click', handler);
        }
    })
 
    return (
        <>
            <Button 
                ref={buttonRef} 
                onClick$={toggle$}
                size={size}
                {...buttonProps}
            >
                <EllipsisVerticalIcon class="w-5 h-5"/>
            </Button>
            <Menu
                ref={menuRef}
                class="hidden data-[show]:block"
                size={size}
                fit={fit}
            >
                <Slot/>
            </Menu>
        </>
    );
});