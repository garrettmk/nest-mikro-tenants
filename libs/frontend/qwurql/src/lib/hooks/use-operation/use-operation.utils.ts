import type { UseOperationState, ResolvedUseOperationState, UseOperationOptions } from "./use-operation.types";
import type { OperationContext, OperationResult } from "@urql/core";
import { noSerialize, useStore, useWatch$, useContext } from "@builder.io/qwik";
import { UrqlContext } from "../../contexts/urql.context";
import { getOperationType } from "../../utils/get-operation-type.util";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { toJSON } from "../../utils/to-json.util";


/** Resolve the client, operation document, operation type, and store other options in state */
export function useOperationState<Data, Variables extends object>(options: UseOperationOptions<Data, Variables>): UseOperationState<Data, Variables> {
    const { clientQrl } = useContext(UrqlContext);
    const state = useStore<UseOperationState<Data, Variables>>({});

    useWatch$(async () => {
        const { operation$, ...otherOptions } = options;

        // Resolve the client and document
        const [client, operation] = await Promise.all([
            clientQrl(),
            operation$()
        ]);

        if (!client || !operation)
            throw new Error(`Can't resolve client or operation`);

        // Get the operation type
        const operationType = getOperationType(operation);
        if (operationType === 'subscription')
            throw new Error(`This hook does not support subscriptions`);

        // Initialize the state object
        state.client = noSerialize(client);
        state.operation = noSerialize(operation);
        state.operationType = operationType;
        Object.assign(state, otherOptions);
    });

    return state;
}

/** Type guard to make sure everything is resolved */
export function isResolvedState<Data, Variables extends object>(state: UseOperationState<Data, Variables>): state is ResolvedUseOperationState<Data, Variables> {
    return Boolean(state.client && state.operation && state.operationType);
}

/** Resolve the request variables */
export async function getVariables<Data, Variables extends object>(state: UseOperationState<Data, Variables>, variables?: Partial<Variables>): Promise<Variables> {
    const initialVariables = 
        typeof state.variables === 'function' ? await state.variables() :
        typeof state.variables === 'object' ? state.variables :
        {};

    return { ...initialVariables, ...variables } as Variables;
}

/** Resolve the request context */
export function getContext<Data, Variables extends object>(state: UseOperationState<Data, Variables>): Partial<OperationContext> {
    return state.context ?? {};
}

/** Execute the operation on the urql client */
export async function executeOperation<D, V extends object>(state: ResolvedUseOperationState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, operation, onExecute$ } = state;
    
    await onExecute$?.(variables);
    return client[operationType](operation, variables, context);
}

/** Return the result, or throw an error */
export async function resolveOrRejectResult<Data, Variables extends object>(state: ResolvedUseOperationState<Data, Variables>, result: OperationResult<Data, Variables>): Promise<Serializable<OperationResult<Data, Variables>>> {
    const { onResult$, onError$, onData$ } = state;

    await onResult$?.(result);

    if (result.error && onError$)
        await onError$(result.error);
    else if (result.error)
        throw result.error;
    else if (onData$)
        await onData$(result.data);

    return toJSON(result);
}