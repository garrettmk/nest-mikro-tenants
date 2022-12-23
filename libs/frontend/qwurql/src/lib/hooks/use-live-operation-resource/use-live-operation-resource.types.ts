import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import type { ControlledPromise, Require } from "@garrettmk/ts-utils";
import type { Serializable } from "@nest-mikro-tenants/core/common";
import type { Client, OperationContext, OperationResult, TypedDocumentNode } from "@urql/core";
import type { OperationTypeNode } from "graphql";
import type { ExecuteQrl, OperationDocumentQrl } from "../../types";
import { OperationResourceReturn } from "../use-operation-resource/use-operation-resource.types";


/** Internal hook state */
export interface UseLiveOperationResourceState<Data, Variables extends object> {
    client?: NoSerialize<Client>
    operation?: NoSerialize<TypedDocumentNode<Data, Variables>>
    operationType?: OperationTypeNode,
    variables?: Partial<Variables> | QRL<() => Partial<Variables>>
    lastUnsubscribe?: NoSerialize<() => void>
    promise?: NoSerialize<ControlledPromise<Serializable<OperationResult<Data, Variables>>>>
    onExecute$?: QRL<(variables: Variables) => void>
    onResult$?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError$?: QRL<(error: any) => void>
    onData$?: QRL<(data: OperationResult<Data, Variables>['data']) => void>
}

/** Internal hook state with everything resolved */
export type ResolvedUseLiveOperationResourceState<Data, Variables extends object> = Require<UseLiveOperationResourceState<Data, Variables>, 'client' | 'operation' | 'operationType' | 'promise'>;

/** Full hook parameters */
export type UseLiveOperationResourceOptions<Data, Variables extends object> = {
    operation$: OperationDocumentQrl<Variables, Data>
    variables?: Partial<Variables> | QRL<() => Partial<Variables>>
    context?: Partial<OperationContext>
    onExecute$?: QRL<(variables: Variables) => void>
    onResult$?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError$?: QRL<(error: any) => void>
    onData$?: QRL<(data: OperationResult<Data, Variables>['data']) => void>
}

/** Hook return value */
export interface UseLiveOperationResourceResult<Data, Variables extends object> {
    result: Partial<Serializable<OperationResult<Data, Variables>>>
    loading: Signal<boolean>
    execute$: ExecuteQrl<Variables>
    resource$: OperationResourceReturn<Data, Variables>
}