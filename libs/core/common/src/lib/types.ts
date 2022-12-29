import { AnyFunction } from "@garrettmk/ts-utils"

export type DataKeys<T extends object> = {
    [K in keyof T]: T[K] extends AnyFunction ? never : K
}[keyof T];

export type DataFields<T extends object> = Pick<T, DataKeys<T>>

export type Serializable<T> = 
    T extends AnyFunction ? never :
    T extends object ? { [K in keyof T]: Serializable<T[K]> } :
    T;