import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor,
  ClassMetadata,
  PropertiesMetadataManager,
  input,
} from '@garrettmk/class-schema';
import { MetadataKeys } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
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
  description?: string;
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
  const { required, omitted, name, description } = optionsWithDefaults(options, modelType);
  const classMetadata: ClassMetadata = { input, description };
  const modelPropertiesMetadata = PropertiesMetadataManager.getMetadata(modelType);
  const propertiesMetadata = omitProperties(requireProperties(modelPropertiesMetadata, required), omitted);

  return BaseObject.createClass({
    name,
    classMetadata,
    propertiesMetadata,
  });
}

/**
 * @internal
 * 
 * Return the options object with default values filled in.
 * 
 * @param options 
 * @param objectType 
 * @returns An options object with all values set
 */
function optionsWithDefaults<M extends BaseModel, R extends MetadataKeys<M> = never, O extends MetadataKeys<M> = never>(
  options: CreateInputOptions<M, R, O> | undefined,
  objectType: Constructor
): Required<CreateInputOptions<M, R, O>> {
  const {
    required = [],
    omitted = [],
    name = `${objectType.name}CreateInput`,
    description = `DTO for creating ${objectType.name} models`,
  } = options ?? {};

  return {
    required,
    omitted,
    name,
    description,
  };
}
