import { Constructor } from "@mikro-orm/core";

export function decorateProperties<T extends object>(target: Constructor<T>, fields: Partial<Record<keyof T, PropertyDecorator>>) {
    Object.entries<PropertyDecorator | undefined>(fields).forEach(([key, decorator]) => {
        decorator?.(target.prototype, key);
    });
}