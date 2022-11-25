import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor,
  ClassMetadata,
  PropertiesMetadataManager,
  input
} from '@garrettmk/class-schema';
import { MetadataKeys } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
import { omitProperties } from './util/omit-properties';
import { requireProperties } from './util/require-properties';
import { Require } from './util/types';

export type UpdatableFields<Model extends BaseModel> = Omit<Model, 'id'>;

/**
 * The default update input.
 */
export type DefaultUpdateInput<Model extends BaseModel> = Partial<
  UpdatableFields<Model>
>;

/**
 * A model's update input. You can specify which fields are required
 * or omitted.
 */
export type UpdateInput<
  Model extends BaseModel,
  Required extends MetadataKeys<UpdatableFields<Model>> = never,
  Omitted extends MetadataKeys<UpdatableFields<Model>> = never
> = Omit<Require<DefaultUpdateInput<Model>, Required>, Omitted>;

/**
 * Options for the UpdateInput factory.
 */
export type UpdateInputOptions<
  Model extends BaseModel = BaseModel,
  Required extends MetadataKeys<UpdatableFields<Model>> = never,
  Omitted extends MetadataKeys<UpdatableFields<Model>> = never
> = {
  required?: Required[]
  omitted?: Omitted[]
  name?: string
  description?: string
};

/**
 *
 * @param modelType The model to base this input on
 * @param options Options for the generated class
 * @returns
 */
export function UpdateInput<
  Model extends BaseModel,
  Required extends MetadataKeys<UpdatableFields<Model>> = never,
  Omitted extends MetadataKeys<UpdatableFields<Model>> = never
>(
  modelType: Constructor<Model>,
  options?: UpdateInputOptions<Model, Required, Omitted>
): BaseObjectConstructor<UpdateInput<Model, Required, Omitted>> {
  const {
    required = [],
    omitted = [],
    name = `${modelType.name}UpdateInput`,
    description = `DTO for updating ${modelType.name} models`
  } = options ?? {};

  const classMetadata: ClassMetadata = { input, description };
  const modelPropertiesMetadata = PropertiesMetadataManager.getMetadata(modelType);
  const propertiesMetadata = omitProperties(
    requireProperties(modelPropertiesMetadata, required),
    ['id', ...omitted]
  );

  return BaseObject.createClass({
    name,
    classMetadata,
    propertiesMetadata
  });
}
