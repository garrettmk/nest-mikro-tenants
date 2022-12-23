import { $, noSerialize, useResource$ } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { pipe, subscribe } from 'wonka';
import { OperationDocumentQrl } from "../../types";
import { UseOperationResourceOptions, UseOperationResourceResult } from "./use-operation-resource.types";
import { executeOperation, getContext, getVariables, isResolvedState, resolveOrRejectResult, unsubscribeLast, useOperationResourceState } from "./use-operation-resource.utils";

/**
 * 
 * @param documentQrl 
 * @param initialVars 
 * @returns 
 */
export function useOperationResource<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Variables
): UseOperationResourceResult<Data, Variables>;

export function useOperationResource<Data, Variables extends object>(
    options: UseOperationResourceOptions<Data, Variables>
): UseOperationResourceResult<Data, Variables>;

export function useOperationResource<Data, Variables extends object>(
    optionsOrQrl: UseOperationResourceOptions<Data, Variables> | OperationDocumentQrl<Variables, Data>,
    variables?: Variables
): UseOperationResourceResult<Data, Variables> {
    const options: UseOperationResourceOptions<Data, Variables> = typeof optionsOrQrl === 'function' 
        ? { operation$: optionsOrQrl, variables } 
        : optionsOrQrl;

    const state = useOperationResourceState(options);

    // Create the operation executor
    const execute$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Can't resolve client or document`);

        unsubscribeLast(state);

        const variables = await getVariables(state, vars);
        const context = getContext(state);

        const { unsubscribe } = pipe(
            await executeOperation(state, variables, context),
            subscribe(result => resolveOrRejectResult(state, result))
        );

        state.lastUnsubscribe = noSerialize(unsubscribe);
    });

    // Create a resource from the state promise
    const resource$ = useResource$<Serializable<OperationResult<Data, Variables>>>(async ({ track }) => {
        const lastUnsubscribe = track(() => state.lastUnsubscribe);
        const promise = track(() => state.promise);

        if (!lastUnsubscribe)
            await execute$();

        return promise!;
    });

    return { resource$, execute$ };
}

/** Aliases for convenience */
export const useQueryResource = useOperationResource;
export const useMutationResource = useOperationResource;
export const useSubscriptionResource = useOperationResource;