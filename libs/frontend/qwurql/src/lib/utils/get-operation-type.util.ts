import { DocumentNode } from "graphql";
import { OperationDefinitionNode, DefinitionNode, Kind } from "graphql";


export function getOperationType(document: DocumentNode) {
    const firstOperation = document.definitions.find(def => isOperationDefinition(def)) as OperationDefinitionNode;
    if (!firstOperation)
        throw new Error(`Document does not contain an operation definition`);

    return firstOperation.operation;
}

export function isOperationDefinition(node: DefinitionNode): node is OperationDefinitionNode {
    return node.kind === Kind.OPERATION_DEFINITION;
}