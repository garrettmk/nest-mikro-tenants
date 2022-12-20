import { useWatch$ } from "@builder.io/qwik";
import { OperateQrl, OperationDocumentQrl, OperationResourceReturn, useOperationResource } from "./use-operation-resource.hook";

export type QueryDocumentQrl<V, D> = OperationDocumentQrl<V, D>;

export type QueryResourceReturn<Data> = OperationResourceReturn<Data>;

export type QueryQrl<Variables> = OperateQrl<Variables>

export function useQuery<Data, Variables extends object>(
    queryQrl: QueryDocumentQrl<Variables, Data>,
    variables?: Partial<Variables>
): [
    QueryResourceReturn<Data>,
    QueryQrl<Variables>
] {
    const [resource$, query$] = useOperationResource(queryQrl, variables);

    useWatch$(({ track }) => {
        if (variables)
            track(variables);

        query$();
    })

    return [resource$, query$];
}