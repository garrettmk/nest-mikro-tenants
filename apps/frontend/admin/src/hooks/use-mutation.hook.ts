import { OperateQrl, OperationDocumentQrl, OperationResourceReturn, useOperationResource } from "./use-operation-resource.hook";

export type MutationDocumentQrl<V, D> = OperationDocumentQrl<V, D>;

export type MutationResourceReturn<Data> = OperationResourceReturn<Data>;

export type MutationQrl<Variables> = OperateQrl<Variables>

export function useMutation<Data, Variables extends object>(
    mutationQrl: MutationDocumentQrl<Variables, Data>,
    variables?: Partial<Variables>
): [
    MutationResourceReturn<Data>,
    MutationQrl<Variables>
] {
    return useOperationResource(mutationQrl, variables);
}