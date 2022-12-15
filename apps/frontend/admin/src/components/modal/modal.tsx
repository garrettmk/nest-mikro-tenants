import { $, component$, HTMLAttributes, PropFunction, QwikMouseEvent, Signal, Slot, useSignal, useWatch$ } from "@builder.io/qwik";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'ref' | 'children'> {
    isOpen?: Signal<boolean>
    onClose$?: PropFunction<() => void>
}


export const Modal = component$((props: ModalProps) => {
    const containerRef = useSignal<Element>();

    useWatch$(({ track }) => {
        track(() => props.isOpen?.value);
        track(() => props.onClose$);

        if (!containerRef.value)
            return;
        
        const container = containerRef.value;
        const parent = container.parentElement;

        // Reparent to the body if necessary
        if (parent && parent !== document.body) {
            parent.removeChild(container);
            document.body.appendChild(container);
        }
    });

    const handleClickOverlay$ = $((event: QwikMouseEvent) => {
        if (event.target === containerRef.value)
            props.onClose$?.();
    });

    return (
        <div 
            ref={containerRef} 
            class={`
                ${props.isOpen?.value ? 'block' : 'hidden'}
                fixed inset-0 bg-[#0f172a80]
            `}
            onClick$={handleClickOverlay$}
        >
            <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <Slot/>
            </div>
        </div>
    )
})