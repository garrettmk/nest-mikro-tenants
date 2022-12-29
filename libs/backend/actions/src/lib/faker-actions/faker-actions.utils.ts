import { faker } from '@faker-js/faker';
import {
  Enum,
  FloatConstructor,
  getTypeInfo,
  Id,
  IdConstructor,
  InnerType,
  IntConstructor,
  PropertyMetadata,
  TypeFn,
} from '@garrettmk/class-schema';
import { AnyFunction, flip, listOf, MaybeArray } from '@garrettmk/ts-utils';
import { random } from 'radash';

/**
 * Return a `TypeFn` that generates an appropriate value, based on the field metadata.
 *
 * @param metadata the field metadata
 * @param fakerFn a function that generates a single value
 * @returns a `TypeFn` that returns either a value, an array of values, or undefined,
 * depending on `metadata`
 */
export function fakerMaker<T, O = T>(metadata: PropertyMetadata<T | T[], O>, fakerFn: TypeFn<InnerType<O>>): TypeFn<O> {
  const { isArray } = getTypeInfo(metadata.type as any);
  const { optional } = metadata;

  const maybeArrayFakerFn: AnyFunction = isArray ? () => listOf(3, () => fakerFn()) : fakerFn;

  const maybeOptionalFakerFn = optional ? () => flip(maybeArrayFakerFn(), undefined) : maybeArrayFakerFn;

  return maybeOptionalFakerFn as TypeFn<O>;
}

/**
 * Options for generateNumber
 */
export type GenerateNumberOptions = {
  min?: number;
  max?: number;
  decimals?: number;
};

/**
 * Returns a randomly-generated number using the given parameters.
 *
 * @param options parameters for the generated number
 * @returns a `number`
 */
export function generateNumber(options?: GenerateNumberOptions): number {
  const { min = 0, max = 1, decimals } = options ?? {};
  const diff = Math.abs(max - min);
  const offset = Math.random() * diff;
  const num = min + offset;

  if (decimals !== undefined) {
    return Math.floor(num * 10 ** decimals) / 10 ** decimals;
  }

  return num;
}

/**
 * Generates a faker function for boolean fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function booleanFieldFaker(metadata: PropertyMetadata<MaybeArray<BooleanConstructor>>) {
  return fakerMaker(metadata, faker.datatype.boolean);
}

/**
 * Generates a faker function for string fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function stringFieldFaker(metadata: PropertyMetadata<MaybeArray<StringConstructor>>) {
  const { maxLength, minLength = 0, in: _in } = metadata;
  let fakerFn: TypeFn<string>;

  if (_in) fakerFn = () => faker.helpers.arrayElement(_in);
  else
    fakerFn = () => {
      const length = maxLength !== undefined ? random(minLength, maxLength) : undefined;
      return faker.datatype.string(length);
    };

  return fakerMaker(metadata, fakerFn);
}

/**
 * Generates a faker function for date fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function dateFieldFaker(metadata: PropertyMetadata<MaybeArray<DateConstructor>>) {
  const { min, max } = metadata;
  let fakerFn: TypeFn<Date>;

  if (min !== undefined && max !== undefined) fakerFn = () => faker.date.between(min, max);
  else if (min !== undefined)
    fakerFn = () => new Date(faker.datatype.number({ min: min.getTime(), max: new Date().getTime() + 10000000 }));
  else if (max !== undefined) fakerFn = () => new Date(faker.datatype.number({ min: 0, max: max.getTime() }));
  else fakerFn = () => faker.date.recent();

  return fakerMaker(metadata, fakerFn);
}

/**
 * Generates a faker function for float fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function floatFieldFaker(metadata: PropertyMetadata<MaybeArray<FloatConstructor>>) {
  const { min, max, eq, ne, in: _in, nin } = metadata;
  let fakerFn: TypeFn<number>;

  if (eq) fakerFn = () => eq;

  if (_in) fakerFn = () => faker.helpers.arrayElement(_in);
  else fakerFn = () => generateNumber({ min, max });

  return fakerMaker(metadata, fakerFn);
}

/**
 * Generates a faker function for integer fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function intFieldFaker(metadata: PropertyMetadata<MaybeArray<IntConstructor>>) {
  const { min, max, eq, ne, in: _in, nin } = metadata;
  let fakerFn: TypeFn<number>;

  if (eq) fakerFn = () => eq;

  if (_in) fakerFn = () => faker.helpers.arrayElement(_in);
  else fakerFn = () => generateNumber({ min, max, decimals: 0 });

  return fakerMaker(metadata, fakerFn);
}

/**
 * Generates a faker function for number fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function numberFieldFaker(metadata: PropertyMetadata<MaybeArray<NumberConstructor>>) {
  // @ts-expect-error too lazy to cast
  return () => flip(intFieldFaker(metadata), floatFieldFaker(metadata))();
}

/**
 * Generates a faker function for Id fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function idFieldFaker(metadata: PropertyMetadata<MaybeArray<IdConstructor>>) {
  return fakerMaker(metadata, () => Id.fake());
}

/**
 * Generates a faker function for enum fields.
 *
 * @param metadata the field metadata
 * @returns a faker function for the field
 */
export function enumFieldFaker(metadata: PropertyMetadata<MaybeArray<Enum>>) {
  // @ts-expect-error idk
  const { innerType } = getTypeInfo(metadata.type);
  const values = Object.values(innerType);
  const fakerFn = () => faker.helpers.arrayElement(values);

  return fakerMaker(metadata, fakerFn);
}
