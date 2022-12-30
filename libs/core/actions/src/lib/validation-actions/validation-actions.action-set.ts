import {
  and,
  ClassMetadata,
  ClassMetadataManager,
  decoratePropertyWith,
  Email,
  Enum,
  getTypeInfo,
  Id,
  innerType,
  innerTypeExtends,
  innerTypeMatches,
  Int,
  isArrayField,
  isConstructorField,
  isEnumField,
  IsId,
  isOptionalField,
  not,
  PropertyMetadata,
  TypeFn,
  withPropertiesMetadata,
} from '@garrettmk/class-schema';
import {
  applyToProperties,
  ifMetadata,
  isSet,
  MetadataActionSetClass,
  MetadataTypeGuard,
  TargetContext,
} from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import { Expose, Type } from 'class-transformer';
import {
  Equals,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  NotEquals,
} from 'class-validator';
import 'reflect-metadata';

export class ValidationActions extends MetadataActionSetClass<ClassMetadata, Constructor>() {
  static manager = ClassMetadataManager;
  static actions = [
    withPropertiesMetadata<ClassMetadata, TargetContext<Constructor>>([
      applyToProperties([
        //
        // Booleans
        //

        ifMetadata(innerTypeMatches(Boolean), [
          decoratePropertyWith((meta) =>
            IsBoolean({
              each: isArrayField(meta),
            })
          ),

          ifMetadata(isSet('eq'), [
            decoratePropertyWith((meta) =>
              Equals(meta.eq, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('ne'), [
            decoratePropertyWith((meta) =>
              NotEquals(meta.ne, {
                each: isArrayField(meta),
              })
            ),
          ]),
        ]),

        //
        // Strings
        //

        ifMetadata(
          and(innerTypeExtends(String), not(innerTypeMatches(Id))) as MetadataTypeGuard<
            PropertyMetadata,
            PropertyMetadata<StringConstructor>
          >,
          [
            decoratePropertyWith((meta) =>
              IsString({
                each: isArrayField(meta),
              })
            ),

            ifMetadata(isSet('eq'), [
              decoratePropertyWith((meta) =>
                Equals(meta.eq, {
                  each: isArrayField(meta),
                })
              ),
            ]),

            ifMetadata(isSet('ne'), [
              decoratePropertyWith((meta) =>
                NotEquals(meta.ne, {
                  each: isArrayField(meta),
                })
              ),
            ]),

            ifMetadata(isSet('re'), [
              decoratePropertyWith((meta) =>
                Matches(meta.re, {
                  each: isArrayField(meta),
                })
              ),
            ]),

            ifMetadata(isSet('in'), [
              decoratePropertyWith((meta) =>
                IsIn(meta.in, {
                  each: isArrayField(meta),
                })
              ),
            ]),

            ifMetadata(isSet('nin'), [
              decoratePropertyWith((meta) =>
                IsNotIn(meta.nin, {
                  each: isArrayField(meta),
                })
              ),
            ]),

            ifMetadata(isSet('minLength'), [
              decoratePropertyWith((meta) =>
                MinLength(meta.minLength, {
                  each: isArrayField(meta),
                })
              ),
            ]),

            ifMetadata(isSet('maxLength'), [
              decoratePropertyWith((meta) =>
                MaxLength(meta.maxLength, {
                  each: isArrayField(meta),
                })
              ),
            ]),
          ]
        ),

        //
        // Email
        //

        ifMetadata(innerTypeMatches(Email), [
          decoratePropertyWith((meta) =>
            IsEmail(
              {},
              {
                each: isArrayField(meta),
              }
            )
          ),
        ]),

        //
        // Numbers
        //

        ifMetadata(innerTypeExtends(Number), [
          decoratePropertyWith((meta) =>
            IsNumber(
              {},
              {
                each: isArrayField(meta),
              }
            )
          ),

          ifMetadata(isSet('min'), [
            decoratePropertyWith((meta) =>
              Min(meta.min, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('max'), [
            decoratePropertyWith((meta) =>
              Max(meta.max, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('eq'), [
            decoratePropertyWith((meta) =>
              Equals(meta.eq, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('ne'), [
            decoratePropertyWith((meta) =>
              NotEquals(meta.ne, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('in'), [
            decoratePropertyWith((meta) =>
              IsIn(meta.in, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('nin'), [
            decoratePropertyWith((meta) =>
              IsNotIn(meta.nin, {
                each: isArrayField(meta),
              })
            ),
          ]),
        ]),

        //
        // Int
        //

        ifMetadata(innerTypeMatches(Int), [
          decoratePropertyWith((meta) =>
            IsInt({
              each: isArrayField(meta),
            })
          ),
        ]),

        //
        // Dates
        //

        ifMetadata(innerTypeMatches(Date), [
          decoratePropertyWith((meta) =>
            IsDate({
              each: isArrayField(meta),
            })
          ),

          ifMetadata(isSet('min'), [
            decoratePropertyWith((meta) =>
              MinDate(meta.min, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('max'), [
            decoratePropertyWith((meta) =>
              MaxDate(meta.max, {
                each: isArrayField(meta),
              })
            ),
          ]),
        ]),

        //
        // Enums
        //

        ifMetadata(isEnumField, [
          decoratePropertyWith((meta) =>
            IsEnum(innerType(meta.type as TypeFn<Enum>), {
              each: isArrayField(meta),
            })
          ),

          ifMetadata(isSet('in'), [
            decoratePropertyWith((meta) =>
              IsIn(meta.in, {
                each: isArrayField(meta),
              })
            ),
          ]),

          ifMetadata(isSet('nin'), [
            decoratePropertyWith((meta) =>
              IsNotIn(meta.nin, {
                each: isArrayField(meta),
              })
            ),
          ]),
        ]),

        //
        // Id
        //

        ifMetadata(innerTypeMatches(Id), [
          decoratePropertyWith((meta) =>
            IsId({
              each: isArrayField(meta),
            })
          ),
        ]),

        //
        // Common
        //

        ifMetadata(
          isOptionalField,
          decoratePropertyWith(() => IsOptional())
        ),

        ifMetadata(
          isArrayField,
          decoratePropertyWith(() => IsArray())
        ),

        ifMetadata(
          and(isConstructorField, not(innerTypeMatches(String, Number, Boolean))),
          decoratePropertyWith((meta) => Type(() => getTypeInfo(meta.type).innerType as Constructor))
        ),

        decoratePropertyWith(() => Expose()),

        // ifMetadata(
        //   isSet('default'),
        //   decoratePropertyWith(meta =>
        //     Transform(value => value ?? meta.default())
        //   )
        // ),
      ]),
    ]),
  ];
}
