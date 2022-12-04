import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor, Id, innerTypeExtends, input, omitProperties, PropertiesMetadataManager, withMetadata
} from '@garrettmk/class-schema';
import { applyToProperties, ifMetadata, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKeys } from '@garrettmk/metadata-manager';
import { Constructor, Require } from '@garrettmk/ts-utils';
import { DeferredActionsRegistry } from './registries/deferred-actions.registry';
import { substituteType } from './util/substitute-type.util';

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
  abstract?: boolean
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
  const { required, omitted, name, description, abstract } = optionsWithDefaults(options, modelType);
  const modelPropertiesMetadata = PropertiesMetadataManager.getMetadata(modelType);

  const generatedClass = BaseObject.createClass<UpdateInput<Model, Required, Omitted>>({
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

  DeferredActionsRegistry.setMetadata(generatedClass, {
    propertiesActions: withMetadata(modelPropertiesMetadata, [
      omitProperties(...omitted),
      applyToProperties([
        updateMetadata((meta, ctx) => ({
          optional: !required.includes(ctx.propertyKey as Required),
          hidden: required.includes(ctx.propertyKey as Required) ? false : meta.hidden,
          description: `Updates the object's ${String(ctx.propertyKey)} property`
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
 function optionsWithDefaults<M extends BaseModel, R extends MetadataKeys<UpdatableFields<M>> = never, O extends MetadataKeys<UpdatableFields<M>> = never>(
  options: UpdateInputOptions<M, R, O> | undefined,
  objectType: Constructor
): Required<UpdateInputOptions<M, R, O>> {
  const {
    required = [],
    omitted = [],
    name = `${objectType.name}UpdateInput`,
    description = `DTO for updating ${objectType.name} models`,
    abstract = false
  } = options ?? {};

  return {
    abstract,
    required,
    omitted,
    name,
    description,
  };
}