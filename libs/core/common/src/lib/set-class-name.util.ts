import { Constructor } from '@garrettmk/class-schema';

export function setClassName(ctor: Constructor, name: string) {
  Object.defineProperty(ctor, 'name', { value: name });
}
