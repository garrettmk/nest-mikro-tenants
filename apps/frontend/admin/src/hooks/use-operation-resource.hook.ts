import { $, NoSerialize, noSerialize, QRL, ResourceReturn, useContext, useResource$, useStore, useWatch$ } from "@builder.io/qwik";
import { ControlledPromise, Require } from "@garrettmk/ts-utils";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { Client, OperationContext, OperationResult, TypedDocumentNode } from "@urql/core";
import { DefinitionNode, DocumentNode, Kind, OperationDefinitionNode } from "graphql";
import { pipe, subscribe } from 'wonka';
import { ApiContext } from "../contexts/api.context";

export type OperationDocumentQrl<V, D> = 
    | QRL<() => TypedDocumentNode<D, V>>
    | QRL<() => Promise<TypedDocumentNode<D, V>>>;

export type OperationResourceReturn<Data> = ResourceReturn<Serializable<OperationResult<Data>>>;

export type OperateQrl<Variables> = QRL<(variables?: Partial<Variables>) => Promise<void>>;

interface UseOperationState<Data, Variables extends object> {
    promise?: NoSerialize<ControlledPromise<Serializable<OperationResult<Data, Variables>>>>
    client?: NoSerialize<Client>
    document?: NoSerialize<TypedDocumentNode<Data, Variables>>
    operationType?: 'query' | 'mutation' | 'subscription',
    lastUnsubscribe?: NoSerialize<() => void>
}

export type ResolvedUseOperationState<Data, Variables extends object> = Require<UseOperationState<Data, Variables>, 'client' | 'document' | 'operationType'>;

export function useOperationResource<Data, Variables extends object>(
    documentQrl: OperationDocumentQrl<Variables, Data>,
    initialVars?: Partial<Variables>
): [
    OperationResourceReturn<Data>,
    OperateQrl<Variables>
] {
    const { clientQrl } = useContext(ApiContext);
    const state = useStore<UseOperationState<Data, Variables>>({});

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
    });

    // Create the operation executor
    const operate$ = $(async (vars?: Partial<Variables>) => {
        if (!isResolvedState(state))
            throw new Error(`Can't resolve client or document`);

        unsubscribeLast(state);

        const context = createFetchContext(state);
        const variables = { ...initialVars, ...vars } as Variables;

        const { unsubscribe } = pipe(
            executeOperation(state, variables, context),
            subscribe(result => resolveOrRejectResult(state, result))
        );

        state.lastUnsubscribe = noSerialize(unsubscribe);
    });

    // Create a resource from the state promise
    const resource$ = useResource$<Serializable<OperationResult<Data>>>(({ track }) => {
        track(() => state.promise);

        return state.promise ?? new ControlledPromise();
    });

    return [resource$, operate$]
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

export function unsubscribeLast(state: ResolvedUseOperationState<any, any>) {
        state.lastUnsubscribe?.();
}

export function createFetchContext<D, V extends object>(state: ResolvedUseOperationState<D, V>): Partial<OperationContext> {
    return {
        fetch: (...args) => {
            state.promise = noSerialize(new ControlledPromise<Serializable<OperationResult<D, V>>>());
            return fetch(...args);
        }
    }
}

export function executeOperation<D, V extends object>(state: ResolvedUseOperationState<D, V>, variables: V, context: Partial<OperationContext>) {
    const { client, operationType, document } = state;

    return client[operationType](document, variables, context);
}

export function resolveOrRejectResult<D, V extends object>(state: ResolvedUseOperationState<D, V>, result: OperationResult<D, V>) {
    if (result.error)
        state.promise?.reject(toJSON(result.error));
    else
        state.promise?.resolve(toJSON(result));
}

export function toJSON<T extends object>(value: T): Serializable<T> {
    return JSON.parse(JSON.stringify(value));
}
