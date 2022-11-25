import { Constructor } from '@garrettmk/ts-utils';

export function setClassName(ctor: Constructor, name: string) {
  Object.defineProperty(ctor, 'name', { value: name });
}
