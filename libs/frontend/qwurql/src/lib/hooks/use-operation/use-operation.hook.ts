import { $, noSerialize, QRL, useContext, useSignal, useStore, useWatch$ } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { UrqlContext } from "../../contexts/urql.context";
import { OperationDocumentQrl } from '../../types';
import { getOperationType } from "../../utils/get-operation-type.util";
import { toJSON } from "../../utils/to-json.util";
import { UseOperationResult, UseOperationState } from "./use-operation.types";
import { executeOperation, isResolvedState } from "./use-operation.utils";

export interface UseOperationOptions<Data, Variables extends object> {
    operation: OperationDocumentQrl<Variables, Data>
    variables?: Partial<Variables>
    onExecute?: QRL<(variables: Variables) => void>
    onResult?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError?: QRL<(error: any) => void>
    onData?: QRL<(data: NonNullable<OperationResult<Data, Variables>['data']>) => void>
}

/**
 * 
 * @param documentQrl 
 * @param initialVars 
 * @returns 
 */
export function useOperation<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Partial<Variables>
): UseOperationResult<Data, Variables>;

export function useOperation<Data, Variables extends object>(
    options: UseOperationOptions<Data, Variables>
): UseOperationResult<Data, Variables>;

export function useOperation<Data, Variables extends object>(optionsOrQrl: UseOperationOptions<Data, Variables> | OperationDocumentQrl<Variables, Data>, variables?: Partial<Variables>): UseOperationResult<Data, Variables> {
    const options = typeof optionsOrQrl === 'function' ? { operation: optionsOrQrl, variables } : optionsOrQrl;
    const { operation: documentQrl, variables: initialVars, onExecute, onResult, onData, onError } = options;

    const { clientQrl } = useContext(UrqlContext);
    const state = useStore<UseOperationState<Data, Variables>>({});
    const result = useSignal<Serializable<OperationResult<Data, Variables>>>();
    const loading = useSignal<boolean>(false);

    // Initialize the state
    useWatch$(async () => {
        const [client, document] = await Promise.all([
            clientQrl(),
            documentQrl()
        ]);

        if (!client || !document)
            throw new Error(`Can't resolve client or document`);

        const operationType = getOperationType(document);
        if (operationType === 'subscription')
            throw new Error(`This hook does not support subscriptions`);

        state.client = noSerialize(client);
        state.document = noSerialize(document);
        state.operationType = operationType;
    });

    // Create the operation executor
    const execute$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Client or document hasn't resolved yet`);

        const variables = { ...initialVars, ...vars } as Variables;
        onExecute?.(variables);

        const operationResult = await executeOperation(state, variables).toPromise();
        onResult?.(operationResult);

        if (operationResult.error && onError)
            onError(operationResult.error);
        else if (operationResult.error)
            throw operationResult.error;

        if (operationResult.data)
            onData?.(operationResult.data);

        result.value = toJSON(operationResult);
    });


    return { result, loading, execute$ };
}

/** Aliases for convenience */
export const useQuery = useOperation;
export const useMutation = useOperation;