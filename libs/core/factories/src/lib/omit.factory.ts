import { BaseObject, BaseObjectConstructor, ClassMetadata, omitProperties, PropertiesMetadataManager, withMetadata } from "@garrettmk/class-schema";
import { MetadataKey } from "@garrettmk/metadata-manager";
import { Constructor } from "@garrettmk/ts-utils";
import { DeferredActionsRegistry } from "./registries/deferred-actions.registry";

export type OmitOptions = ClassMetadata & {
    name?: string
}

export function Omit<T extends object, K extends keyof T>(objectType: Constructor<T>, keys: K[], options?: OmitOptions): BaseObjectConstructor<Omit<T, K>> {
    const { name, ...classMetadata } = options ?? {};

    const generatedClass = BaseObject.createClass<Omit<T, K>>({
        name,
        classMetadata,
        propertiesMetadata: {}
    });

    DeferredActionsRegistry.setMetadata(generatedClass, {
        propertiesActions: withMetadata(() => PropertiesMetadataManager.getMetadata(objectType), [
            omitProperties(...(keys as MetadataKey[]))
        ])
    });

    return generatedClass;
}