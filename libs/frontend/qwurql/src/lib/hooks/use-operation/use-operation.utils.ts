import type { UseOperationState, ResolvedUseOperationState } from "./use-operation.types";
import type { OperationContext } from "@urql/core";

/** Type guard to make sure everything is resolved */
export function isResolvedState<Data, Variables extends object>(state: UseOperationState<Data, Variables>): state is ResolvedUseOperationState<Data, Variables> {
    return Boolean(state.client && state.document && state.operationType);
}

/** Execute the operation on the urql client */
export function executeOperation<D, V extends object>(state: ResolvedUseOperationState<D, V>, variables: V, context?: Partial<OperationContext>) {
    const { client, operationType, document } = state;

    return client[operationType](document, variables, context);
}
