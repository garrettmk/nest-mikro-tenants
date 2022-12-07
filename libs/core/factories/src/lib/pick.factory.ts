import { BaseObject, BaseObjectConstructor, ClassMetadata, pickProperties, PropertiesMetadataManager, withMetadata } from "@garrettmk/class-schema";
import { MetadataKey } from "@garrettmk/metadata-manager";
import { Constructor } from "@garrettmk/ts-utils";
import { FactoryActions } from "./registries/deferred-actions.registry";


export type PickOptions = ClassMetadata & {
    name?: string
}


export function Pick<T extends object, K extends keyof T>(objectType: Constructor<T>, keys: K[], options?: PickOptions): BaseObjectConstructor<Pick<T, K>> {
    const { name, ...classMetadata } = options ?? {};

    const generatedClass = BaseObject.createClass<Pick<T, K>>({
        name,
        classMetadata,
        propertiesMetadata: {}
    });

    FactoryActions.setMetadata(generatedClass, {
        propertiesActions: withMetadata(() => PropertiesMetadataManager.getMetadata(objectType), [
            pickProperties(...(keys as MetadataKey[]))
        ])
    });

    return generatedClass;
}