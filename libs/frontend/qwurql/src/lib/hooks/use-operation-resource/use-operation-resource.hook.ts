import { $, noSerialize, useContext, useResource$, useStore, useWatch$ } from "@builder.io/qwik";
import { ControlledPromise } from "@garrettmk/ts-utils";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { OperationResult } from "@urql/core";
import { pipe, subscribe } from 'wonka';
import { UrqlContext } from "../../contexts/urql.context";
import { OperationDocumentQrl } from "../../types";
import { getOperationType } from "../../utils/get-operation-type.util";
import { UseOperationResourceOptions, UseOperationResourceResult, UseOperationResourceState } from "./use-operation-resource.types";
import { createFetchContext, executeOperation, isResolvedState, resolveOrRejectResult, unsubscribeLast } from "./use-operation-resource.utils";

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
    optionsOrDocumentQrl: UseOperationResourceOptions<Data, Variables> | OperationDocumentQrl<Variables, Data>,
    variables?: Variables
): UseOperationResourceResult<Data, Variables> {
    const options = typeof optionsOrDocumentQrl === 'function' ? { operation: optionsOrDocumentQrl, variables } : optionsOrDocumentQrl;
    const { operation: documentQrl, variables: initialVars, onExecute } = options;

    const { clientQrl } = useContext(UrqlContext);
    const state = useStore<UseOperationResourceState<Data, Variables>>({});

    // Create the operation executor
    const execute$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Can't resolve client or document`);

        unsubscribeLast(state);

        const context = createFetchContext(state);
        const variables = { ...initialVars, ...vars } as Variables;

        onExecute?.(variables);
        const { unsubscribe } = pipe(
            executeOperation(state, variables, context),
            subscribe(result => resolveOrRejectResult(state, result, options))
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
        state.promise = noSerialize(new ControlledPromise<Serializable<OperationResult<Data, Variables>>>());
        await execute$();
    });

    // Create a resource from the state promise
    const resource$ = useResource$<Serializable<OperationResult<Data, Variables>>>(({ track }) => {
        track(() => state.promise);
        return state.promise ?? new ControlledPromise();
    });

    return { resource$, execute$ };
}

/** Aliases for convenience */
export const useQueryResource = useOperationResource;
export const useMutationResource = useOperationResource;
export const useSubscriptionResource = useOperationResource;