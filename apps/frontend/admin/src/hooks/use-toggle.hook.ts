import { $, QRL, Signal, useSignal } from "@builder.io/qwik";

export interface ToggleMethods {
    on$: QRL<() => void>
    off$: QRL<() => void>
    toggle$: QRL<() => void>
}

export type UseToggleResult = [Signal<boolean>, ToggleMethods];

export function useToggle(initialValue?: boolean): UseToggleResult {
    const value = useSignal(initialValue ?? false);
    const on$ = $(() => value.value = true);
    const off$ = $(() => value.value = false);
    const toggle$ = $(() => value.value = !value.value);

    return [value, {
        on$,
        off$,
        toggle$
    }];
}