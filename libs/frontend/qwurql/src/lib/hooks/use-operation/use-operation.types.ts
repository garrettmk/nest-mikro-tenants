import type { NoSerialize, Signal } from "@builder.io/qwik"
import type { Client, OperationResult, TypedDocumentNode } from '@urql/core';
import type { OperationTypeNode } from "graphql";
import type { Require } from "@garrettmk/ts-utils";
import type { Serializable } from "@nest-mikro-tenants/core/common";
import type { ExecuteQrl } from "../../types";


/** Internal hook state */
export interface UseOperationState<Data, Variables extends object> {
    client?: NoSerialize<Client>
    document?: NoSerialize<TypedDocumentNode<Data, Variables>>
    operationType?: Exclude<OperationTypeNode, 'subscription'>
}

/** Internal hook state with everything resolved */
export type ResolvedUseOperationState<Data, Variables extends object> = 
    Require<UseOperationState<Data, Variables>, 'client' | 'document' | 'operationType'>


/** Hook return value */
export interface UseOperationResult<Data, Variables extends object> {
    result: Signal<Serializable<OperationResult<Data, Variables>> | undefined>
    loading: Signal<boolean>
    execute$: ExecuteQrl<Variables>
}
