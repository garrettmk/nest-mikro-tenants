import { BaseObject, BaseObjectConstructor, PropertiesMetadataManager } from "@garrettmk/class-schema";
import { MetadataKey } from "@garrettmk/metadata-manager";
import { Constructor } from "@garrettmk/ts-utils";
import { omit } from 'radash';



export function Omit<T extends object, K extends keyof T>(objectType: Constructor<T>, keys: K[]): BaseObjectConstructor<Omit<T, K>> {
    const objectPropertiesMeta = PropertiesMetadataManager.getMetadata(objectType);
    const omittedPropertiesMeta = omit(objectPropertiesMeta, keys as MetadataKey[]);

    return BaseObject.createClass({
        propertiesMetadata: omittedPropertiesMeta
    });
}