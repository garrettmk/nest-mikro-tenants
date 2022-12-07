import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor, Id, innerTypeExtends, input, omitProperties, PropertiesMetadataManager, withMetadata
} from '@garrettmk/class-schema';
import { applyToProperties, ifMetadata, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKeys } from '@garrettmk/metadata-manager';
import { Constructor, Require } from '@garrettmk/ts-utils';
import { FactoryActions } from './registries/deferred-actions.registry';
import { substituteType } from './util/substitute-type.util';


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
  required?: Required[]
  omitted?: Omitted[]
  name?: string
  description?: string
  abstract?: boolean
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
  const { required, omitted, name, description, abstract } = optionsWithDefaults(options, modelType);
  const modelPropertiesMetadata = PropertiesMetadataManager.getMetadata(modelType);

  const generatedClass = BaseObject.createClass<CreateInput<Model, Required, Omitted>>({
    name,
    classMetadata: {
      input,
      description,
      abstract
    },
    propertiesMetadata: {
      error: {
        type: () => String,
        default: () => `The deferred actions for ${name} have not been run yet`
      }
    },
  });

  FactoryActions.setMetadata(generatedClass, {
    propertiesActions: withMetadata(modelPropertiesMetadata, [
      omitProperties(...omitted),

      applyToProperties([
        updateMetadata((meta, ctx) =>  ({
          optional: !required.includes(ctx.propertyKey as Required),
          hidden: required.includes(ctx.propertyKey as Required) ? false : meta.hidden,
        })),

        ifMetadata(
          innerTypeExtends(BaseModel),
          substituteType(() => Id)
        )
      ])
    ])
  });

  return generatedClass;
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
    abstract = false
  } = options ?? {};

  return {
    required,
    omitted,
    name,
    description,
    abstract
  };
}