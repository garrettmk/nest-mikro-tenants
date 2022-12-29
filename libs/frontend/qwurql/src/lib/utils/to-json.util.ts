import { Serializable } from '@nest-mikro-tenants/core/common';

export function toJSON<T>(value: T): Serializable<T> {
    return JSON.parse(JSON.stringify(value));
}
