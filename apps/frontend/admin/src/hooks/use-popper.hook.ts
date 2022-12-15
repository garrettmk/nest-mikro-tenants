import { $, NoSerialize, noSerialize, PropFunction, QRL, Signal, useClientEffect$, useSignal, useStore } from "@builder.io/qwik";
import { createPopper, Instance, OptionsGeneric } from "@popperjs/core";

export interface UsePopperState {
    instance: NoSerialize<Instance> | undefined
    isShowing: boolean
}

export interface UsePopperApi {
    show$: QRL<() => void>
    hide$: QRL<() => void>
    toggle$: QRL<() => void>
}

export function usePopper(containerRef: Signal<Element | undefined>, popperRef: Signal<HTMLElement | undefined>, options?: PropFunction<() => Partial<OptionsGeneric<any>>>) {
    const state = useStore<UsePopperState>({
        instance: undefined,
        isShowing: false
    });


    const api = useStore<UsePopperApi>({
        show$: $(() => {
            popperRef.value?.setAttribute('data-show', '');
            state.isShowing = true;
            
            state.instance?.setOptions((options: any) => ({
                ...options,
                modifiers: [
                    ...(options.modifiers ?? []),
                    { name: 'eventListeners', enabled: true }
                ]
            }));
        }),

        hide$: $(() => {
            popperRef.value?.removeAttribute('data-show');
            state.isShowing = false;

            state.instance?.setOptions((options: any) => ({
                ...options,
                modifiers: [
                    ...(options.modifiers ?? []),
                    { name: 'eventListeners', enabled: false }
                ]
            }));    
        }),

        toggle$: $(() => {
            if (state.isShowing)
                popperRef.value?.removeAttribute('data-show');
            else
                popperRef.value?.setAttribute('data-show', '');

            state.isShowing = !state.isShowing;

            state.instance?.setOptions((options: any) => ({
                ...options,
                modifiers: [
                    ...(options.modifiers ?? []),
                    { name: 'eventListeners', enabled: state.isShowing }
                ]
            }));    
        })
    });

    useClientEffect$(async ({ track }) => {
        track(() => containerRef.value);
        track(() => popperRef.value);

        if (!containerRef.value || !popperRef.value)
            return;

        const optionsValues = await options?.();
        const instance = createPopper(containerRef.value, popperRef.value, optionsValues);

        state.instance = noSerialize(instance);
    });

    return { state, ...api };
}