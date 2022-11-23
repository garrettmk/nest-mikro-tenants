export type Require<T, K extends keyof T> = T & Pick<Required<T>, K>;