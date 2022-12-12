import { PropertiesMetadataManager } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { DocumentNode } from "graphql";
import gql from 'graphql-tag';


export function propertiesFragment(target: Constructor, fragmentName = `${target.name}Fields`): DocumentNode {
    const properties = PropertiesMetadataManager.getMetadata(target);
    const keys = Object.entries(properties)
        .filter(([, meta]) => !meta.hidden)
        .map(([key]) => key);
    
    return gql`
        fragment ${fragmentName} on ${target.name} {
            ${keys.join('\n')}
        }
    `;
}