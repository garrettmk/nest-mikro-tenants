import type { UseOperationResourceState, ResolvedUseOperationResourceState, UseOperationResourceOptions } from "./use-operation-resource.types";
import { noSerialize, useContext, useStore, useWatch$ } from "@builder.io/qwik";
import { ControlledPromise } from "@garrettmk/ts-utils";
import { OperationContext, OperationResult } from "@urql/core";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { toJSON } from "../../utils/to-json.util";
import { UrqlContext } from "../../contexts/urql.context";
import { getOperationType } from "../../utils/get-operation-type.util";

/** Resolve the client, operation document, operation type, and store other options in state */
export function useOperationResourceState<Data, Variables extends object>(options: UseOperationResourceOptions<Data, Variables>): UseOperationResourceState<Data, Variables> {
    const { clientQrl } = useContext(UrqlContext);
    const state = useStore<UseOperationResourceState<Data, Variables>>({});

    useWatch$(async () => {
        const { operation$, ...otherOptions } = options;

        const [client, operation] = await Promise.all([
            clientQrl(),
            operation$()
        ]);

        if (!client || !operation)
            throw new Error(`Can't resolve client or operation`);

        state.client = noSerialize(client);
        state.operation = noSerialize(operation);
        state.operationType = getOperationType(operation);
        state.promise = noSerialize(new ControlledPromise<Serializable<OperationResult<Data, Variables>>>());
        Object.assign(state, otherOptions);
    });

    return state;
}

/** Type guard to make sure everything is resolved */
export function isResolvedState<Data, Variables extends object>(state: UseOperationResourceState<Data, Variables>): state is ResolvedUseOperationResourceState<Data, Variables> {
    return Boolean(state.client && state.operation && state.operationType);
}

/** Resolve the request variables */
export async function getVariables<Data, Variables extends object>(state: UseOperationResourceState<Data, Variables>, variables?: Partial<Variables>): Promise<Variables> {
    const initialVariables =
        typeof state.variables === 'function' ? await state.variables() :
        typeof state.variables === 'object' ? state.variables :
        {};

    return { ...initialVariables, ...variables } as Variables
}

/** Unsubscribes from the previous query */
export function unsubscribeLast(state: ResolvedUseOperationResourceState<any, any>) {
        state.lastUnsubscribe?.();
}

/** Adds a wrapped fetch() method that creates a new promise in state when a request is sent */
export function getContext<D, V extends object>(state: ResolvedUseOperationResourceState<D, V>): Partial<OperationContext> {
    const { context } = state;
    const { fetch: _fetch = fetch, ...otherContext } = context ?? {};

    return {
        fetch: (...args) => {
            if (state.lastUnsubscribe)
                state.promise = noSerialize(new ControlledPromise<Serializable<OperationResult<D, V>>>());
            
            return _fetch(...args);
        },
        
        ...otherContext
    }
}


/** Execute the operation on the urql client */
export async function executeOperation<D, V extends object>(state: ResolvedUseOperationResourceState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, operation, onExecute$ } = state;

    await onExecute$?.(variables);

    return client[operationType](operation, variables, context);
}

/** Rejects on GraphQL errors */
export function resolveOrRejectResult<D, V extends object>(state: ResolvedUseOperationResourceState<D, V>, result: OperationResult<D, V>) {
    const { onError$, onResult$, onData$ } = state;
    console.log({ result })
    onResult$?.(result);

    if (result.error) {
        onError$?.(result.error);
        state.promise?.reject(toJSON(result.error));
    } else {
        onData$?.(result.data);
        state.promise?.resolve(toJSON(result));
    }
}
