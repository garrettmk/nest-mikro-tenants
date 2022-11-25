import { BaseObject, BaseObjectConstructor, PropertiesMetadataManager } from "@garrettmk/class-schema";
import { MetadataKey } from "@garrettmk/metadata-manager";
import { Constructor } from "@garrettmk/ts-utils";
import { pick } from 'radash';



export function Pick<T extends object, K extends keyof T>(objectType: Constructor<T>, keys: K[]): BaseObjectConstructor<Pick<T, K>> {
    const objectPropertiesMeta = PropertiesMetadataManager.getMetadata(objectType);
    const pickedPropertiesMeta = pick(objectPropertiesMeta, keys as MetadataKey[]);

    return BaseObject.createClass({
        propertiesMetadata: pickedPropertiesMeta
    });
}