import { noSerialize, Signal, useContext, useStore, useWatch$ } from "@builder.io/qwik";
import { OperationContext, OperationResult } from "@urql/core";
import { omit } from "radash";
import { UrqlContext } from "../../contexts/urql.context";
import { getOperationType } from "../../utils/get-operation-type.util";
import { toJSON } from "../../utils/to-json.util";
import type { ResolvedUseLiveOperationState, SimplifiedOperationResult, UseLiveOperationState } from "./use-live-operation.types";
import { UseLiveOperationOptions } from "./use-live-operation.types";

/** Resolve the client, operation document, operation type, and store other options in state */
export function useLiveOperationState<Data, Variables extends object>(options: UseLiveOperationOptions<Data, Variables>): UseLiveOperationState<Data, Variables> {
    const { clientQrl } = useContext(UrqlContext);
    const state = useStore<UseLiveOperationState<Data, Variables>>({});

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
        Object.assign(state, otherOptions);
    });

    return state;
}

/** Type guard to make sure everything is resolved */
export function isResolvedState<Data, Variables extends object>(state: UseLiveOperationState<Data, Variables>): state is ResolvedUseLiveOperationState<Data, Variables> {
    return Boolean(state.client && state.operation && state.operationType);
}

/** Resolve the request variables */
export async function getVariables<Data, Variables extends object>(state: UseLiveOperationState<Data, Variables>, variables?: Partial<Variables>): Promise<Variables> {
    const initialVariables =
        typeof state.variables === 'function' ? await state.variables() :
        typeof state.variables === 'object' ? state.variables :
        {};

    return { ...initialVariables, ...variables } as Variables
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
export async function executeOperation<D, V extends object>(state: ResolvedUseLiveOperationState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, operation, onExecute$ } = state;

    await onExecute$?.(variables);

    return client[operationType](operation, variables, context);
}

/** Handle results  */
export async function handleResult<D, V extends object>(state: ResolvedUseLiveOperationState<D, V>, result: OperationResult<D, V>): Promise<SimplifiedOperationResult<D>> {
    const { onResult$, onError$, onData$ } = state;

    await onResult$?.(result);

    if (result.error)
        await onError$?.(result.error);
    else
        await onData$?.(result.data);

    return simplifyOperationResult(result);
}

/**  */
export function simplifyOperationResult<D>(result: OperationResult<D>): SimplifiedOperationResult<D> {
    const { data, extensions, stale, hasNext, error } = result;

    return {
        data,
        extensions,
        stale,
        hasNext,
        error: error ? {
            name: error.name,
            message: error.message,
            graphQLErrors: error.graphQLErrors.map(e => e.toJSON()),
            networkError: toJSON(error.networkError),
            response: toJSON(error.response),
        } : error,
    }
}