import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { setClassName } from "@nest-mikro-tenants/core/common";
import { CreateInput, Paginated, PaginationInput, UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { Args, ID as GqlId, Info, Int as GqlInt, Mutation, Query, ObjectType as GqlObjectType } from '@nestjs/graphql';
import { instanceToPlain } from "class-transformer";
import { GraphQLResolveInfo } from 'graphql';
import { CrudService } from "./crud-service.factory";
import { fieldsToRelations } from "./util/fields-to-relations.util";
import { ParseCuidPipe } from "./util/parse-cuid.pipe";

export const defaultPagination: PaginationInput = { offset: 0, limit: 10 };

export type ResolverMap<
  TSingle extends string,
  TPlural extends string = `${TSingle}s`
> = {
  get: `get${TSingle}`;
  createOne: `createOne${TSingle}`;
  createMany: `createMany${TPlural}`;
  findOne: `findOne${TSingle}`;
  findMany: `findMany${TPlural}`;
  updateOne: `updateOne${TSingle}`;
  updateMany: `updateMany${TPlural}`;
  deleteOne: `deleteOne${TSingle}`;
  deleteMany: `deleteMany${TPlural}`;
  count: `count${TPlural}`;
};

export type AbstractCrudResolvers<
  TEntity extends BaseModel,
  TCreate extends CreateInput<TEntity>,
  TUpdate extends UpdateInput<TEntity>,
  TWhere extends WhereInput<TEntity>,
  TWhereOne extends WhereOneInput<TEntity, 'id'>
> = {
  get: (id: string, info?: GraphQLResolveInfo) => Promise<TEntity>;
  createOne: (input: TCreate, info?: GraphQLResolveInfo) => Promise<TEntity>;
  createMany: (inputs: TCreate[], info?: GraphQLResolveInfo) => Promise<TEntity[]>;
  findOne: (where: TWhereOne, info?: GraphQLResolveInfo) => Promise<TEntity>;
  findMany: (where: TWhere, groupBy: string, paginate: PaginationInput, info?: GraphQLResolveInfo) => Promise<Paginated<TEntity>>;
  updateOne: (where: TWhereOne, update: TUpdate, info?: GraphQLResolveInfo) => Promise<TEntity>;
  updateMany: (where: TWhere, update: TUpdate, info?: GraphQLResolveInfo) => Promise<TEntity[]>;
  deleteOne: (where: TWhereOne, info?: GraphQLResolveInfo) => Promise<TEntity>;
  deleteMany: (where: TWhere, info?: GraphQLResolveInfo) => Promise<TEntity>;
  count: (where: TWhere, info?: GraphQLResolveInfo) => Promise<number>;
};

export type ResolvedMethods = keyof ResolverMap<string>;

export type CrudResolvers<
  T extends BaseModel,
  C extends CreateInput<T>,
  U extends UpdateInput<T>,
  W extends WhereInput<T>,
  W1 extends WhereOneInput<T, 'id'>,
  Service extends CrudService<T, C, U, W, W1>,
  SingleName extends string,
  PluralName extends string = `${SingleName}s`
> = {
  [Key in ResolvedMethods as ResolverMap<SingleName, PluralName>[Key]]: AbstractCrudResolvers<T, C, U, W, W1>[Key];
};

export type CrudResolversConstructor<
  T extends BaseModel,
  C extends CreateInput<T>,
  U extends UpdateInput<T>,
  W extends WhereInput<T>,
  W1 extends WhereOneInput<T, 'id'>,
  Service extends CrudService<T, C, U, W, W1>,
  SingleName extends string,
  PluralName extends string = `${SingleName}s`
> = new (service: Service) => CrudResolvers<T, C, U, W, W1, Service, SingleName, PluralName>;


export function CrudResolvers<
    T extends BaseModel,
    C extends CreateInput<T>,
    U extends UpdateInput<T>,
    W extends WhereInput<T>,
    W1 extends WhereOneInput<T, keyof T>,
    S extends CrudService<T, C, U, W, W1>,
    Single extends string,
    Plural extends string
>(
    entity: Constructor<T>,
    createInput: Constructor<C>,
    updateInput: Constructor<U>,
    whereInput: Constructor<W>,
    whereOneInput: Constructor<W1>,
    paginated: Constructor<Paginated<T>>,
    single: Single = entity.name as Single,
    plural: Plural = `${entity.name}s` as Plural
): Constructor<CrudResolvers<T, C, U, W, W1, S, Single, Plural>> {
    class GeneratedCrudResolvers implements CrudResolvers<T, C, U, W, W1, S, Single, Plural> {
        constructor(protected readonly service: S) {}

        @Mutation(() => entity)
        async [`createOne${single}`](
          @Args('input', { type: () => createInput }) input: C,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          const { id } = await this.service.createOne(input);
    
          return this.service.get(id, { populate });
        }

        @Mutation(() => [entity])
        async [`createMany${plural}`](
          @Args('inputs', { type: () => [createInput] }) inputs: C[],
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          const entities = await this.service.createMany(inputs);
          const ids = entities.map(({ id }) => id);
    
          // @ts-expect-error idk
          return this.service.findMany({
              id: { in: ids },
            }, { 
              populate 
            }
          );
        }
    
        @Query(() => entity)
        async [`get${single}`](
          @Args('id', { type: () => GqlId }, ParseCuidPipe) id: string,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          return this.service.get(id, { populate });
        }
    
        @Query(() => entity)
        async [`findOne${single}`](
          @Args('where', { type: () => whereOneInput })
          where: W1,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);    
          return this.service.findOne(where, { populate });
        }
    
        @Query(() => paginated)
        async [`findMany${plural}`](
          @Args('where', { type: () => whereInput, nullable: true }) where: W,
          @Args('groupBy', { type: () => String, nullable: true }) groupBy: string[],
          @Args('paginate', { type: () => PaginationInput, nullable: true }) paginate: PaginationInput = defaultPagination,
          @Info() info: GraphQLResolveInfo
        ): Promise<Paginated<T>> {
          const populate = fieldsToRelations(info, { root: 'items' });
          const pagination = instanceToPlain(paginate, { exposeUnsetFields: false });
          const groupByPlain = groupBy ? { groupBy } : {};
    
          const entities = await this.service.findMany(where, {
            populate,
            ...pagination,
            ...groupByPlain,
          });
    
          const total = await this.service.count(where);
    
          return {
            items: entities,
            pagination: {
              total: total,
              offset: pagination.offset,
              limit: pagination.limit,
            }
          };
        }
    
        @Mutation(() => entity)
        async [`updateOne${single}`](
          @Args('where', { type: () => whereOneInput }) where: W1,
          @Args('update', { type: () => updateInput }) update: U,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          return this.service.updateOne(where, update, { populate });
        }
    
        @Mutation(() => [entity])
        async [`updateMany${plural}`](
          @Args('where', { type: () => whereInput }) where: W,
          @Args('update', { type: () => updateInput }) update: U,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          return this.service.updateMany(where, update, { populate });
        }
    
        @Mutation(() => entity)
        async [`deleteOne${single}`](
          @Args('where', { type: () => whereOneInput }) where: W1,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          return this.service.deleteOne(where, { populate });
        }
    
        @Mutation(() => [entity])
        async [`deleteMany${plural}`](
          @Args('where', { type: () => whereInput }) where: W,
          @Info() info: GraphQLResolveInfo
        ) {
          const populate = fieldsToRelations(info);
          return this.service.deleteMany(where, { populate });
        }
    
        @Query(() => GqlInt)
        async [`count${plural}`](
          @Args('where', { type: () => whereInput, nullable: true }) where: W,
        ) {
          return this.service.count(where);
        }
    }

    return GeneratedCrudResolvers;
}