import { Signal, useClientEffect$, useStore } from '@builder.io/qwik';
import { Serializable } from '@nest-mikro-tenants/core/common';
import { toJSON } from '@nest-mikro-tenants/frontend/qwurql';

export function useMeasure(ref: Signal<HTMLElement | undefined>): Serializable<DOMRect> {
    const rect = useStore<Serializable<DOMRect>>(() => toJSON(new DOMRect()));

    useClientEffect$(({ track }) => {
        const element = track(() => ref.value);
        if (element) 
            Object.assign(rect, toJSON(element.getBoundingClientRect()));
    });

    return rect;
}