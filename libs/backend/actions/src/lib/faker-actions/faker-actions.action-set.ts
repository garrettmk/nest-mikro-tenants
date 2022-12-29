import {
  applyActionsToPropertyMetadata,
  ClassMetadata,
  ClassMetadataManager,
  Float,
  Id,
  innerTypeExtends,
  innerTypeMatches,
  Int,
  isEnumField,
} from '@garrettmk/class-schema';
import { ifMetadata, isUnset, MetadataActionSetClass, updateMetadata } from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import {
  booleanFieldFaker,
  dateFieldFaker,
  enumFieldFaker,
  floatFieldFaker,
  idFieldFaker,
  intFieldFaker,
  numberFieldFaker,
  stringFieldFaker,
} from './faker-actions.utils';

export class FakerActions extends MetadataActionSetClass<ClassMetadata, Constructor>() {
  static manager = ClassMetadataManager;

  static actions = [
    applyActionsToPropertyMetadata([
      //
      // Booleans
      //

      ifMetadata(innerTypeMatches(Boolean), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: booleanFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Strings
      //

      ifMetadata(innerTypeMatches(String), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: stringFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Numbers
      //

      ifMetadata(innerTypeExtends(Number), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: numberFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Ints
      //

      ifMetadata(innerTypeMatches(Int), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: intFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Floats
      //

      ifMetadata(innerTypeMatches(Float), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: floatFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Dates
      //

      ifMetadata(innerTypeMatches(Date), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: dateFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Enums
      //

      ifMetadata(isEnumField, [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: enumFieldFaker(meta),
          })),
        ]),
      ]),

      //
      // Id
      //

      ifMetadata(innerTypeMatches(Id), [
        ifMetadata(isUnset('faker'), [
          updateMetadata((meta) => ({
            faker: idFieldFaker(meta),
          })),
        ]),
      ]),
    ]),
  ];
}
