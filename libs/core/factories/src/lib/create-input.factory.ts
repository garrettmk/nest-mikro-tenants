import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor, input, makePropertiesOptional,
  makePropertiesRequired,
  omitProperties, PropertiesMetadata, PropertiesMetadataManager
} from '@garrettmk/class-schema';
import { applyActions, applyActionsToProperties, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKey, MetadataKeys } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
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
  const modelPropertiesMetadata = PropertiesMetadataManager.getMetadata(modelType);

  return BaseObject.createClass({
    name,
    classMetadata: {
      input,
      description
    },
    propertiesMetadata: toCreateInputProperties(modelPropertiesMetadata, required, omitted)
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

/**
 * @internal
 *
 * @param metadata
 * @param required
 * @param omitted
 * @returns
 */
function toCreateInputProperties(metadata: PropertiesMetadata, required: MetadataKey[], omitted: MetadataKey[]): PropertiesMetadata {
  const properties = applyActions(metadata, {}, [
    omitProperties(...omitted),
    applyActionsToProperties(updateMetadata((meta, ctx) => ({
      optional: !required.includes(ctx.propertyKey),
      hidden: required.includes(ctx.propertyKey) ? false : meta.hidden
    }))),
  ]);

  return properties;
}