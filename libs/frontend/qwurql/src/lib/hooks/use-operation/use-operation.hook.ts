import { $, useSignal } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { OperationDocumentQrl } from '../../types';
import { UseOperationOptions, UseOperationResult } from "./use-operation.types";
import { executeOperation, getContext, getVariables, isResolvedState, resolveOrRejectResult, useOperationState } from "./use-operation.utils";

/**
 * 
 * @param operation$ 
 * @param variables 
 * @returns 
 */
export function useOperation<Data, Variables extends object>(
    operation$: OperationDocumentQrl<Variables, Data>,
    variables?: Partial<Variables>
): UseOperationResult<Data, Variables>;

export function useOperation<Data, Variables extends object>(
    options: UseOperationOptions<Data, Variables>
): UseOperationResult<Data, Variables>;

export function useOperation<Data, Variables extends object>(optionsOrQrl: UseOperationOptions<Data, Variables> | OperationDocumentQrl<Variables, Data>, variables?: Partial<Variables>): UseOperationResult<Data, Variables> {
    const options = typeof optionsOrQrl === 'function' ? { operation$: optionsOrQrl, variables } : optionsOrQrl;
    const state = useOperationState(options);
    const result = useSignal<Serializable<OperationResult<Data, Variables>>>();
    const loading = useSignal<boolean>(false);

    // Create the operation executor
    const execute$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Client or document hasn't resolved yet`);

        const variables = await getVariables(state, vars);
        const context = getContext(state);

        const operationResult = await executeOperation(state, variables, context).toPromise();
        result.value = await resolveOrRejectResult(state, operationResult);
    });


    return { result, loading, execute$ };
}

/** Aliases for convenience */
export const useQuery = useOperation;
export const useMutation = useOperation;