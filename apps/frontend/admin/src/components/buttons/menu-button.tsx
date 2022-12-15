import { component$, Slot, useSignal, useWatch$ } from "@builder.io/qwik";
import { EllipsisVerticalIcon } from "heroicons-qwik/20/solid";
import { usePopper } from "../../hooks/use-popper.hook";
import { Menu, MenuProps } from "../menu/menu";
import { ButtonProps } from "./button";
import { ToolButton } from "./tool-button";

export type MenuButtonProps = Omit<ButtonProps, 'href' | 'onClick$' | 'ref'> & MenuProps;

export const MenuButton = component$((props: MenuButtonProps) => {
    const { size, fit, ...buttonProps } = props;
    const buttonRef = useSignal<HTMLElement>();
    const menuRef = useSignal<HTMLElement>();
    const { state, toggle$, hide$ } = usePopper(buttonRef, menuRef);

    useWatch$(({ track }) => {
        track(() => state.isShowing);
        const { isShowing } = state;

        const handler = (event: MouseEvent) => {
            if (event.target !== menuRef.value)
                hide$();
        }

        if (isShowing) {
            document.addEventListener('click', handler);
            return () => document.removeEventListener('click', handler);
        }
    })

    return (
        <>
            <ToolButton
                ref={buttonRef}
                onClick$={toggle$}
                {...buttonProps}
            >
                <EllipsisVerticalIcon class="w-5 h-5"/>

                <Menu
                    ref={menuRef}
                    class="hidden data-[show]:block"
                    size={size}
                    fit={fit}
                >
                    <Slot/>
                </Menu>
            </ToolButton>
        </>
    );
})