import { $, noSerialize, useContext, useSignal, useStore, useWatch$ } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { UrqlContext } from "../../contexts/urql.context";
import { OperationDocumentQrl } from '../../types';
import { getOperationType } from "../../utils/get-operation-type.util";
import { toJSON } from "../../utils/to-json.util";
import { UseOperationResult, UseOperationState } from "./use-operation.types";
import { executeOperation, isResolvedState } from "./use-operation.utils";

/**
 * 
 * @param documentQrl 
 * @param initialVars 
 * @returns 
 */
export function useOperation<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Partial<Variables>
): UseOperationResult<Data, Variables> {
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

        const operationResult = await executeOperation(state, variables).toPromise();
        if (operationResult.error)
            throw operationResult.error;

        result.value = toJSON(operationResult);
    });


    return { result, loading, execute$ };
}

/** Aliases for convenience */
export const useQuery = useOperation;
export const useMutation = useOperation;