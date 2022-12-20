import { QRL, useContext, useResource$ } from "@builder.io/qwik";
import { OperationResult, TypedDocumentNode } from "@urql/core";
import { ApiContext } from "../contexts/api.context";

export type QueryQrl<V, D> = 
    | QRL<() => TypedDocumentNode<D, V>>
    | QRL<() => Promise<TypedDocumentNode<D, V>>>;

export function useSimpleQuery<Data, Variables extends object>(queryQrl: QueryQrl<Variables, Data>, variables: Variables) {
    const { clientQrl } = useContext(ApiContext);

    const resource$ = useResource$<OperationResult<Data, Variables>>(async ({ track }) => {
        track(variables);

        const [client, query] = await Promise.all([
            clientQrl(),
            queryQrl()
        ]);

        const request = client!.query(query, variables).toPromise();
        
        return request.then(result => {
            if (result.error)
                throw result.error;
            
            return result;
        });
    });

    return resource$;
}