import { $, noSerialize, useResource$, useSignal, useStore } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { pipe, subscribe } from 'wonka';
import { OperationDocumentQrl } from "../../types";
import { UseLiveOperationResourceOptions, UseLiveOperationResourceResult } from "./use-live-operation-resource.types";
import { createFetchContext, executeOperation, getVariables, handleResult, isResolvedState, unsubscribeLast, useLiveOperationResourceState } from "./use-live-operation-resource.utils";

/**
 * 
 * @param documentQrl 
 * @param initialVars 
 * @returns 
 */
export function useLiveOperationResource<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Variables
): UseLiveOperationResourceResult<Data, Variables>;

export function useLiveOperationResource<Data, Variables extends object>(
    options: UseLiveOperationResourceOptions<Data, Variables>
): UseLiveOperationResourceResult<Data, Variables>;

export function useLiveOperationResource<Data, Variables extends object>(
    optionsOrQrl: UseLiveOperationResourceOptions<Data, Variables> | OperationDocumentQrl<Variables, Data>,
    variables?: Variables
): UseLiveOperationResourceResult<Data, Variables> {
    const options: UseLiveOperationResourceOptions<Data, Variables> = typeof optionsOrQrl === 'function' 
        ? { operation$: optionsOrQrl, variables } 
        : optionsOrQrl;

    const state = useLiveOperationResourceState(options);
    const loading = useSignal(false);
    const result = useStore<Partial<Serializable<OperationResult<Data, Variables>>>>({}, {
        recursive: true 
    });

    // Create the operation executor
    const execute$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Can't resolve client or document`);

        unsubscribeLast(state);

        const context = createFetchContext(loading);
        const variables = await getVariables(state, vars);

        const { unsubscribe } = pipe(
            await executeOperation(state, variables, context),
            subscribe(async opResult => {
                loading.value = false;
                
                const serializableResult = await handleResult(state, opResult);
                Object.assign(result, serializableResult);

                if (state.promise.state === 'pending') {
                    if (opResult.error)
                        state.promise.reject(result.error);
                    else
                        state.promise.resolve(result as Serializable<OperationResult<Data, Variables>>);
                }
            })
        );

        state.lastUnsubscribe = noSerialize(unsubscribe);
    });

    const resource$ = useResource$(() => {
        if (!isResolvedState(state))
            throw new Error(`State not resolved yet`)

        if (!state.lastUnsubscribe)
            execute$();

        return state.promise;
    });

    return { result, loading, execute$, resource$ };
}

/** Aliases for convenience */
export const useLiveQueryResource = useLiveOperationResource;
export const useLiveMutationResource = useLiveOperationResource;
export const useLiveSubscriptionResource = useLiveOperationResource;