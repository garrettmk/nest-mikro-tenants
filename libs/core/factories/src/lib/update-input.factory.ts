import {
  BaseModel,
  BaseObject,
  BaseObjectConstructor, Id, input, omitProperties, PropertiesMetadata, PropertiesMetadataManager,
  innerTypeExtends, innerTypeMatches,
  or
} from '@garrettmk/class-schema';
import { applyActions, applyActionsToProperties, ifMetadata, updateMetadata } from '@garrettmk/metadata-actions';
import { MetadataKey, MetadataKeys } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
import { substituteType } from './util/substitute-type.util';
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

  return BaseObject.createClass({
    name,
    classMetadata: {
      input,
      description,
      abstract
    },
    propertiesMetadata: toUpdateInputProperties(modelPropertiesMetadata, required, omitted)
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

/**
 * @internal
 *
 * @param metadata
 * @param required
 * @param omitted
 * @returns
 */
 function toUpdateInputProperties(metadata: PropertiesMetadata, required: MetadataKey[], omitted: MetadataKey[]): PropertiesMetadata {
  const properties = applyActions(metadata, {}, [
    omitProperties(...omitted),
    applyActionsToProperties([
      updateMetadata((meta, ctx) => ({
        optional: !required.includes(ctx.propertyKey),
        hidden: required.includes(ctx.propertyKey) ? false : meta.hidden,
        description: `Updates the object's ${String(ctx.propertyKey)} property`
      })),

      ifMetadata(
        or(
          // @ts-expect-error abstract class constructor
          innerTypeExtends(BaseModel),
          // @ts-expect-error undefined not a constructor
          innerTypeMatches(undefined)
        ),
        substituteType(() => Id)
      )
    ]),
  ]);

  return properties;
}