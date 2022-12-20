import { ResourceReturn, Signal, useSignal, useWatch$ } from "@builder.io/qwik";

export function useResourceLoading(resource: ResourceReturn<any>, initial?: boolean): Signal<boolean> {
    const loading = useSignal(initial ?? false);
    useWatch$(({ track }) => {
        const promise = track(() => resource.promise);
        loading.value = resource.loading;

        promise.finally(() => loading.value = false);
    });

    return loading;
}