import { Signal } from "@builder.io/qwik";
import { OperationContext } from "@urql/core";
import type { ResolvedUseLiveOperationState, UseLiveOperationState } from "./use-live-operation.types";


/** Type guard to make sure everything is resolved */
export function isResolvedState<Data, Variables extends object>(state: UseLiveOperationState<Data, Variables>): state is ResolvedUseLiveOperationState<Data, Variables> {
    return Boolean(state.client && state.document && state.operationType);
}

/** Unsubscribes from the previous query */
export function unsubscribeLast(state: ResolvedUseLiveOperationState<any, any>) {
        state.lastUnsubscribe?.();
}

/** Adds a wrapped fetch() method that creates a new promise in state when a request is sent */
export function createFetchContext<D, V extends object>(loading: Signal<boolean>): Partial<OperationContext> {
    return {
        fetch: (...args) => {
            loading.value = true;
            return fetch(...args);
        }
    }
}

/** Execute the operation on the urql client */
export function executeOperation<D, V extends object>(state: ResolvedUseLiveOperationState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, document } = state;

    return client[operationType](document, variables, context);
}