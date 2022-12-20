import { TypedDocumentNode } from "@urql/core";
import { QRL } from "@builder.io/qwik";

export type OperationDocumentQrl<V, D> = 
    | QRL<() => TypedDocumentNode<D, V>>
    | QRL<() => Promise<TypedDocumentNode<D, V>>>;


export type ExecuteQrl<Variables> = QRL<(variables?: Partial<Variables>) => Promise<void>>;
