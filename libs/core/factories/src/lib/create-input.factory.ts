import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor,
  Constructor,
  PropertiesMetadataManager,
} from '@garrettmk/class-schema';
import { MetadataKeys } from '@garrettmk/metadata-manager';
import { omitProperties } from './util/omit-properties';
import { requireProperties } from './util/require-properties';
import { Require } from './util/types';

/**
 * The default create input.
 */
export type DefaultCreateInput<Model extends BaseModel> = Partial<Model>;

/**
 * A model's create input. You can specify which fields are required
 * or omitted.
 */
export type CreateInput<
  Model extends BaseModel,
  Required extends MetadataKeys<Model> = never,
  Omitted extends MetadataKeys<Model> = never
> = Omit<Require<DefaultCreateInput<Model>, Required>, Omitted>;

/**
 * Options for the CreateInput factory.
 */
export type CreateInputOptions<
  Model extends BaseModel = BaseModel,
  Required extends MetadataKeys<Model> = never,
  Omitted extends MetadataKeys<Model> = never
> = {
  required?: Required[];
  omitted?: Omitted[];
  name?: string;
};

/**
 *
 * @param modelType The model to base this input on
 * @param options Options for the generated class
 * @returns
 */
export function CreateInput<
  Model extends BaseModel,
  Required extends MetadataKeys<Model> = never,
  Omitted extends MetadataKeys<Model> = never
>(
  modelType: Constructor<Model>,
  options?: CreateInputOptions<Model, Required, Omitted>
): BaseObjectConstructor<CreateInput<Model, Required, Omitted>> {
  const {
    required = [],
    omitted = [],
    name = `${modelType.name}CreateInput`,
  } = options ?? {};

  const modelPropertiesMetadata =
    PropertiesMetadataManager.getMetadata(modelType);
  const propertiesMetadata = omitProperties(
    requireProperties(modelPropertiesMetadata, required),
    omitted
  );

  return BaseObject.createClass({ name, propertiesMetadata });
}
