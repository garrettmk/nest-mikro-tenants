import { QRL } from "@builder.io/qwik";
import { TypedDocumentNode } from "@urql/core";

export type OperationDocumentQrl<V, D> = 
    | QRL<() => TypedDocumentNode<D, V>>
    | QRL<() => Promise<TypedDocumentNode<D, V>>>;


export type ExecuteQrl<Variables extends object> = QRL<(variables?: Partial<Variables>) => Promise<void>>;
