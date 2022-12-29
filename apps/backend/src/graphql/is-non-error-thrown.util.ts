
export type NonErrorThrown = {
  name: 'NonErrorThrown',
  thrownValue: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNonErrorThrown(value: any): value is NonErrorThrown {
  return typeof value === 'object' 
    && value !== null
    && 'name' in value 
    && value.name === 'NonErrorThrown';
}