import { $, QRL, Signal, useSignal } from "@builder.io/qwik";

export interface ToggleSignal extends Signal<boolean> {
    on$: QRL<() => void>
    off$: QRL<() => void>
    toggle$: QRL<() => void>
}

export function useToggle(initialValue?: boolean): ToggleSignal {
    const signal = useSignal(initialValue ?? false) as ToggleSignal;
    signal.on$ = $(() => { signal.value = true });
    signal.off$ = $(() => { signal.value = false });
    signal.toggle$ = $(() => { signal.value = !signal.value });
    
    return signal;
}