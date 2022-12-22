import type { UseOperationResourceState, ResolvedUseOperationResourceState, UseOperationResourceOptions } from "./use-operation-resource.types";
import { noSerialize } from "@builder.io/qwik";
import { ControlledPromise } from "@garrettmk/ts-utils";
import { OperationContext, OperationResult } from "@urql/core";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { toJSON } from "../../utils/to-json.util";


/** Type guard to make sure everything is resolved */
export function isResolvedState<Data, Variables extends object>(state: UseOperationResourceState<Data, Variables>): state is ResolvedUseOperationResourceState<Data, Variables> {
    return Boolean(state.client && state.document && state.operationType);
}

/** Unsubscribes from the previous query */
export function unsubscribeLast(state: ResolvedUseOperationResourceState<any, any>) {
        state.lastUnsubscribe?.();
}

/** Adds a wrapped fetch() method that creates a new promise in state when a request is sent */
export function createFetchContext<D, V extends object>(state: ResolvedUseOperationResourceState<D, V>): Partial<OperationContext> {
    return {
        fetch: (...args) => {
            state.promise = noSerialize(new ControlledPromise<Serializable<OperationResult<D, V>>>());
            return fetch(...args);
        }
    }
}

/** Execute the operation on the urql client */
export function executeOperation<D, V extends object>(state: ResolvedUseOperationResourceState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, document } = state;

    return client[operationType](document, variables, context);
}

/** Rejects on GraphQL errors */
export function resolveOrRejectResult<D, V extends object>(state: ResolvedUseOperationResourceState<D, V>, result: OperationResult<D, V>, options: UseOperationResourceOptions<D, V>) {
    const { onError, onResult, onData } = options;

    onResult?.(result);

    if (result.error) {
        onError?.(result.error);
        state.promise?.reject(toJSON(result.error));
    } else {
        onData?.(result.data!);
        state.promise?.resolve(toJSON(result));
    }
}
