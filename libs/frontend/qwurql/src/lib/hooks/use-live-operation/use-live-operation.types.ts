import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import type { Require } from "@garrettmk/ts-utils";
import type { Serializable } from "@nest-mikro-tenants/core/common";
import type { Client, OperationContext, OperationResult, TypedDocumentNode } from "@urql/core";
import type { OperationTypeNode } from "graphql";
import type { ExecuteQrl, OperationDocumentQrl } from "../../types";


/** Internal hook state */
export interface UseLiveOperationState<Data, Variables extends object> {
    client?: NoSerialize<Client>
    operation?: NoSerialize<TypedDocumentNode<Data, Variables>>
    operationType?: OperationTypeNode,
    variables?: Partial<Variables> | QRL<() => Partial<Variables>>
    lastUnsubscribe?: NoSerialize<() => void>
    onExecute$?: QRL<(variables: Variables) => void>
    onResult$?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError$?: QRL<(error: any) => void>
    onData$?: QRL<(data: OperationResult<Data, Variables>['data']) => void>
}

/** Internal hook state with everything resolved */
export type ResolvedUseLiveOperationState<Data, Variables extends object> = Require<UseLiveOperationState<Data, Variables>, 'client' | 'operation' | 'operationType'>;

/** Full hook parameters */
export type UseLiveOperationOptions<Data, Variables extends object> = {
    operation$: OperationDocumentQrl<Variables, Data>
    variables?: Partial<Variables> | QRL<() => Partial<Variables>>
    context?: Partial<OperationContext>
    onExecute$?: QRL<(variables: Variables) => void>
    onResult$?: QRL<(result: OperationResult<Data, Variables>) => void>
    onError$?: QRL<(error: any) => void>
    onData$?: QRL<(data: OperationResult<Data, Variables>['data']) => void>
}

/** Hook return value */
export interface UseLiveOperationResult<Data, Variables extends object> {
    result: Signal<Serializable<OperationResult<Data, Variables>> | undefined>
    loading: Signal<boolean>
    execute$: ExecuteQrl<Variables>
}