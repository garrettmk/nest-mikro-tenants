import { $, component$, Signal, useClientEffect$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Placement } from "@popperjs/core";
import { usePopper } from "../../hooks/use-popper.hook";

export interface TooltipProps {
    text: string
    element: string | Signal<HTMLElement | undefined>
}

export const Tooltip = component$((props: TooltipProps) => {
    useStyles$(ArrowCSS);

    const { text, element } = props;
    const containerRef = useSignal<Element>()
    const tooltipRef = useSignal<HTMLElement>();
    const { show$, hide$ } = usePopper(containerRef, tooltipRef, $(() => ({
        placement: 'top' as Placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 5]
                }
            }
        ]
    })));

    useClientEffect$(async ({ track }) => {
        track(() => element);

        if (typeof element === 'string')
            containerRef.value = document.querySelector(element) ?? undefined;
        else
            containerRef.value = element.value;

        containerRef.value?.addEventListener('mouseenter', show$);
        containerRef.value?.addEventListener('mouseleave', hide$);

        return () => {
            containerRef.value?.removeEventListener('mouseenter', show$);
            containerRef.value?.removeEventListener('mouseleave', hide$);
        }
    });

    return (
        <div
            ref={tooltipRef} 
            class="tooltip hidden data-[show]:block bg-white py-1 px-2 rounded-md text-xs text-gray-600 shadow-xl"
        >
            {text}
            <div class="tooltip-arrow" data-popper-arrow/>
        </div>
    );
});

export const ArrowCSS = `
    .tooltip-arrow,
    .tooltip-arrow::before {
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
    }

    .tooltip-arrow {
        visibility: hidden;
    }

    .tooltip-arrow::before {
        visibility: visible;
        content: '';
        transform: rotate(45deg);
    }

    [data-popper-placement^='top'] > .tooltip-arrow {
        bottom: -4px;
    }
      
    [data-popper-placement^='bottom'] > .tooltip-arrow {
        top: -4px;
    }
      
    [data-popper-placement^='left'] > .tooltip-arrow {
        right: -4px;
    }
      
    [data-popper-placement^='right'] > .tooltip-arrow {
        left: -4px;
    }
`