import { $, NoSerialize, noSerialize, Signal, useContext, useSignal, useStore, useWatch$ } from "@builder.io/qwik";
import { Require } from "@garrettmk/ts-utils";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { Client, OperationContext, OperationResult, TypedDocumentNode } from "@urql/core";
import { DefinitionNode, DocumentNode, Kind, OperationDefinitionNode } from "graphql";
import { ApiContext } from "../contexts/api.context";
import { OperateQrl, OperationDocumentQrl } from './use-operation-resource.hook';


interface UseOperationState<Data, Variables extends object> {
    client?: NoSerialize<Client>
    document?: NoSerialize<TypedDocumentNode<Data, Variables>>
    operationType?: 'query' | 'mutation',
}

export type ResolvedUseOperationState<Data, Variables extends object> = 
    Require<UseOperationState<Data, Variables>, 'client' | 'document' | 'operationType'>;


export interface UseOperationResult<Data, Variables extends object> {
    result: Signal<Serializable<OperationResult<Data, Variables>> | undefined>
    loading: Signal<boolean>
    execute$: OperateQrl<Variables>
}

export function useOperation<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Partial<Variables>
): UseOperationResult<Data, Variables> {
    const { clientQrl } = useContext(ApiContext);
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

        state.client = noSerialize(client);
        state.document = noSerialize(document);
        //@ts-expect-error subscriptions
        state.operationType = getOperationType(document);
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


export function getOperationType(document: DocumentNode) {
    const firstOperation = document.definitions.find(def => isOperationDefinition(def)) as OperationDefinitionNode;
    if (!firstOperation)
        throw new Error(`Document does not contain an operation definition`);

    return firstOperation.operation;
}

export function isOperationDefinition(node: DefinitionNode): node is OperationDefinitionNode {
    return node.kind === Kind.OPERATION_DEFINITION;
}

export function isResolvedState<Data, Variables extends object>(state: UseOperationState<Data, Variables>): state is ResolvedUseOperationState<Data, Variables> {
    return Boolean(state.client && state.document && state.operationType);
}

export function executeOperation<D, V extends object>(state: ResolvedUseOperationState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, document } = state;

    return client[operationType](document, variables, context);
}

export function toJSON<T extends object>(value: T): Serializable<T> {
    return JSON.parse(JSON.stringify(value));
}
