import { BaseModel, PropertiesMetadataManager } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { CreateInput, UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { DocumentNode } from "graphql";
// import gql from 'graphql-tag';
import { gql } from '@urql/core';


export class ModelGraphQlDocuments<T extends BaseModel> {
    fragment: DocumentNode;
    fragmentName: string;

    get: DocumentNode;
    createOne: DocumentNode;
    createMany: DocumentNode;
    findOne: DocumentNode
    findMany: DocumentNode
    updateOne: DocumentNode
    updateMany: DocumentNode
    deleteOne: DocumentNode
    deleteMany: DocumentNode
    count: DocumentNode

    constructor(
        target: Constructor<T>,
        createInput: Constructor<CreateInput<T>>,
        whereOneInput: Constructor<WhereOneInput<T>>,
        whereInput: Constructor<WhereInput<T>>,
        updateInput: Constructor<UpdateInput<T>>,
    ) {
        const properties = PropertiesMetadataManager.getMetadata(target);
        const keys = Object.entries(properties)
            .filter(([, meta]) => !meta.hidden)
            .map(([key]) => key);

        const targetName = target.name;
        const pluralName = targetName + 's';
        const fragmentName = targetName + 'Fields';

        this.fragmentName = fragmentName;
        
        this.fragment = gql`
            fragment ${fragmentName} on ${targetName} {
                ${keys.join('\n')}
            }
        `;

        this.get = gql`
            query Get${targetName}($id: ID!) {
                get${targetName}(id: $id) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.createOne = gql`
            mutation CreateOne${targetName}($input: ${createInput.name}) {
                createOne${targetName}(input: $input) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.createMany = gql`
            mutation CreateMany${pluralName}($inputs: [${createInput.name}!]!) {
                createMany${pluralName}(inputs: $inputs) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.findOne = gql`
            query FindOne${targetName}($where: ${whereOneInput.name}) {
                findOne${targetName}(where: $where) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.findMany = gql`
            query FindMany${pluralName}($where: ${whereInput.name}) {
                findMany${pluralName}(where: $where) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.updateOne = gql`
            mutation UpdateOne${targetName}($where: ${whereOneInput.name}, $update: ${updateInput.name}) {
                updateOne${targetName}(where: $where, update: $update) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.updateMany = gql`
            mutation UpdateMany${pluralName}($where: ${whereInput.name}, $update: ${updateInput.name}) {
                updateMany${pluralName}(where: $where, update: $update) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.deleteOne = gql`
            mutation DeleteOne${targetName}($where: ${whereOneInput.name}) {
                deleteOne${targetName}(where: $where) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.deleteMany = gql`
            mutation DeleteMany${pluralName}($where: ${whereInput.name}) {
                deleteMany${pluralName}(where: $where) {
                   ...${fragmentName}
                }
            }

            ${this.fragment}
        `;

        this.count = gql`
            query Count${pluralName}($where: ${whereInput.name}) {
                count${pluralName}(where: $where) {
                    ...${fragmentName}
                }
            }

            ${this.fragment}
        `;
    }
}