import { $, noSerialize, useContext, useResource$, useSignal, useStore, useWatch$ } from "@builder.io/qwik";
import { ControlledPromise } from "@garrettmk/ts-utils";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { pipe, subscribe } from 'wonka';
import { UrqlContext } from "../../contexts/urql.context";
import { OperationDocumentQrl } from "../../types";
import { getOperationType } from "../../utils/get-operation-type.util";
import { toJSON } from "../../utils/to-json.util";
import { UseLiveOperationResult, UseLiveOperationState } from "./use-live-operation.types";
import { createFetchContext, executeOperation, isResolvedState, unsubscribeLast } from "./use-live-operation.utils";

/**
 * 
 * @param documentQrl 
 * @param initialVars 
 * @returns 
 */
export function useLiveOperation<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Variables
): UseLiveOperationResult<Data, Variables> {
    const { clientQrl } = useContext(UrqlContext);
    const state = useStore<UseLiveOperationState<Data, Variables>>({});
    const result = useSignal<Serializable<OperationResult<Data, Variables>>>();
    const loading = useSignal(false);

    // Create the operation executor
    const execute$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Can't resolve client or document`);

        unsubscribeLast(state);

        const context = createFetchContext(loading);
        const variables = { ...initialVars, ...vars } as Variables;

        const { unsubscribe } = pipe(
            executeOperation(state, variables, context),
            subscribe(opResult => {
                loading.value = false;
                result.value = toJSON(opResult);
            })
        );

        state.lastUnsubscribe = noSerialize(unsubscribe);
    });

    // Initialize the state
    useWatch$(async () => {
        const [client, document] = await Promise.all([
            clientQrl(),
            documentQrl()
        ]);

        if (!client || !document)
            throw new Error(`Can't resolve client or document`);

        state.client = noSerialize(client);
        state.document = noSerialize(document);
        state.operationType = getOperationType(document);
        await execute$();
    });

    return { result, loading, execute$ };
}

/** Aliases for convenience */
export const useLiveQuery = useLiveOperation;
export const useLiveMutation = useLiveOperation;
export const useLiveSubscription = useLiveOperation;