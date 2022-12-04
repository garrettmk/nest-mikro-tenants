import { MetadataManagerClass } from "@garrettmk/metadata-manager";
import { Constructor } from "@garrettmk/ts-utils";
import { EntitySchema } from "@mikro-orm/core";



export class EntitySchemaRegistry extends MetadataManagerClass<EntitySchema, Constructor>() {
  public static getEntitySchema(target: Constructor): EntitySchema {
    return super.getMetadata(target);
  }

  public static setEntitySchema(target: Constructor, schema: EntitySchema) {
    return super.setMetadata(target, schema);
  }

  public static getEntitySchemas(): EntitySchema[] {
    return this.entries().map(([, schema]) => schema);
  }
}