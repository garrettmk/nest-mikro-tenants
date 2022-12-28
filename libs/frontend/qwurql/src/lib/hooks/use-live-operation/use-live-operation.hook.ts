import { $, noSerialize, useSignal } from "@builder.io/qwik";
import { pipe, subscribe } from 'wonka';
import { OperationDocumentQrl } from "../../types";
import { SimplifiedOperationResult, UseLiveOperationOptions, UseLiveOperationResult } from "./use-live-operation.types";
import { createFetchContext, executeOperation, getVariables, handleResult, isResolvedState, unsubscribeLast, useLiveOperationState } from "./use-live-operation.utils";

/**
 * 
 * @param documentQrl 
 * @param initialVars 
 * @returns 
 */
export function useLiveOperation<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Variables
): UseLiveOperationResult<Data, Variables>;

export function useLiveOperation<Data, Variables extends object>(
    options: UseLiveOperationOptions<Data, Variables>
): UseLiveOperationResult<Data, Variables>;

export function useLiveOperation<Data, Variables extends object>(
    optionsOrQrl: UseLiveOperationOptions<Data, Variables> | OperationDocumentQrl<Variables, Data>,
    variables?: Variables
): UseLiveOperationResult<Data, Variables> {
    const options: UseLiveOperationOptions<Data, Variables> = typeof optionsOrQrl === 'function' 
        ? { operation$: optionsOrQrl, variables } 
        : optionsOrQrl;

    const state = useLiveOperationState(options);
    const result = useSignal<SimplifiedOperationResult<Data, Variables>>();
    const loading = useSignal(false);

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
                result.value = await handleResult(state, opResult);
            })
        );

        state.lastUnsubscribe = noSerialize(unsubscribe);
    });

    return { result, loading, execute$ };
}

/** Aliases for convenience */
export const useLiveQuery = useLiveOperation;
export const useLiveMutation = useLiveOperation;
export const useLiveSubscription = useLiveOperation;