import type { QRL, ResourceReturn, NoSerialize } from "@builder.io/qwik";
import type { TypedDocumentNode, OperationResult, Client, OperationContext } from "@urql/core";
import type { OperationTypeNode } from "graphql";
import type { ControlledPromise, Require } from "@garrettmk/ts-utils";
import type { Serializable } from "@nest-mikro-tenants/core/common";
import type { ExecuteQrl, OperationDocumentQrl } from "../../types";


/** The resource type */
export type OperationResourceReturn<Data, Variables extends object> = ResourceReturn<Serializable<OperationResult<Data, Variables>>>;

/** Internal hook state */
export interface UseOperationResourceState<Data, Variables extends object> {
    client?: NoSerialize<Client>
    operation?: NoSerialize<TypedDocumentNode<Data, Variables>>
    operationType?: OperationTypeNode
    context?: Partial<OperationContext>
    variables?: Partial<Variables> | QRL<() => Partial<Variables>>
    promise?: NoSerialize<ControlledPromise<Serializable<OperationResult<Data, Variables>>>>
    lastUnsubscribe?: NoSerialize<() => void>
    onExecute$?: QRL<(variables: Variables) => void>
    onResult$?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError$?: QRL<(error: any) => void>
    onData$?: QRL<(data: OperationResult<Data, Variables>['data']) => void>
}

/** Internal hook state with everything resolved */
export type ResolvedUseOperationResourceState<Data, Variables extends object> = Require<UseOperationResourceState<Data, Variables>, 'client' | 'operation' | 'operationType'>;


/** Full hook parameters */
export interface UseOperationResourceOptions<Data, Variables extends object> {
    operation$: OperationDocumentQrl<Variables, Data>
    variables?: Partial<Variables> | QRL<() => Partial<Variables>>
    onExecute$?: QRL<(variables: Variables) => void>
    onResult$?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError$?: QRL<(error: any) => void>
    onData$?: QRL<(data: OperationResult<Data, Variables>['data']) => void>
    context?: Partial<OperationContext>
}


/** Hook return value */
export interface UseOperationResourceResult<Data, Variables extends object> {
    resource$: OperationResourceReturn<Data, Variables>
    execute$: ExecuteQrl<Variables>
}