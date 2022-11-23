import { CreateInput, UpdateInput, WhereInput, WhereOneInput } from "@nest-mikro-tenants/core/factories"
import { BaseModel, Constructor, BaseObjectConstructor, Id } from "@garrettmk/class-schema"
import { FilterQuery, RequiredEntityData, EntityData } from '@mikro-orm/core';
import { AutoPath } from "@mikro-orm/core/typings";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { instanceToPlain } from "class-transformer";
import { setClassName } from "@nest-mikro-tenants/core/common";


export type FindOptions<T> = {
    populate?: AutoPath<T, string>[]
    limit?: number
    offset?: number
    groupBy?: string | string[]
}

export type FindOneOptions<T> = Omit<FindOptions<T>, 'limit' | 'offset'>;

export interface CrudService<
    T extends BaseModel = BaseModel,
    TCreate extends CreateInput<T> = CreateInput<T>,
    TUpdate extends UpdateInput<T> = UpdateInput<T>,
    TWhere extends WhereInput<T> = WhereInput<T>,
    TWhereOne extends WhereOneInput<T, 'id'> = WhereOneInput<T, 'id'>
> {
    get(id: Id, options?: FindOneOptions<T>): Promise<T>
    createOne(input: TCreate): Promise<T>
    createMany(inputs: TCreate[]): Promise<T[]>
    findOne(where: TWhereOne, options?: FindOneOptions<T>): Promise<T>
    findMany(where?: TWhere, options?: FindOptions<T>): Promise<T[]>
    updateOne(where: TWhereOne, update: TUpdate, options?: FindOneOptions<T>): Promise<T>
    updateMany(where: TWhere, update: TUpdate, options?: FindOptions<T>): Promise<T[]>
    deleteOne(where: TWhereOne, options?: FindOneOptions<T>): Promise<T>
    deleteMany(where: TWhere, options?: FindOptions<T>): Promise<T[]>
    count(where?: TWhere): Promise<number>
}

export function CrudService<
    T extends BaseModel,
    C extends CreateInput<T>,
    U extends UpdateInput<T>,
    W extends WhereInput<T>,
    W1 extends WhereOneInput<T, keyof T>
>(
    entity: BaseObjectConstructor<T>,
    createInput: BaseObjectConstructor<C>,
    updateInput: BaseObjectConstructor<U>,
    whereInput: BaseObjectConstructor<W>,
    whereOneInput: BaseObjectConstructor<W1>
): Constructor<CrudService<T, C, U, W, W1>> {
    const name = `${entity.name}CrudService`;

    class GeneratedCrudService implements CrudService<T, C, U, W, W1> {
        protected static async toFilterQuery(data: W): Promise<FilterQuery<T>> {
            const valid = await whereInput.from(data);
            return instanceToPlain(valid, { exposeUnsetFields: false }) as FilterQuery<T>;
        }

        protected static async toFilterOneQuery(data: W1): Promise<FilterQuery<T>> {
            const valid = await whereOneInput.from(data);
            return instanceToPlain(valid, { exposeUnsetFields: false }) as FilterQuery<T>;
        }

        protected static async toCreateInput(data: C): Promise<RequiredEntityData<T>> {
            const valid = await createInput.from(data);
            return instanceToPlain(valid, { exposeUnsetFields: false }) as RequiredEntityData<T>;
        }

        protected static async toUpdateInput(data: U): Promise<EntityData<T>> {
            const valid = await updateInput.from(data);
            return instanceToPlain(valid, { exposeUnsetFields: false }) as EntityData<T>;
        }

        
        constructor(
            @InjectRepository(entity)
            protected readonly repo: EntityRepository<T>
        ) {}
        
        public async get(id: Id, options?: FindOneOptions<T> | undefined): Promise<T> {
            return this.repo.findOneOrFail({ id } as FilterQuery<T>, options);
        }

        public async createOne(input: C): Promise<T> {
            const createInput = await GeneratedCrudService.toCreateInput(input);
            const entity = this.repo.create(createInput);

            await this.repo.persistAndFlush(entity);
            return entity;
        }

        public async createMany(inputs: C[]): Promise<T[]> {
            const createInputs = await Promise.all(inputs.map(i => GeneratedCrudService.toCreateInput(i)));
            const entities = createInputs.map(input => this.repo.create(input as RequiredEntityData<T>));

            await this.repo.persistAndFlush(entities);
            return entities;
        }

        public async findOne(where: W1, options?: FindOneOptions<T>): Promise<T> {
            const filterQuery = await  GeneratedCrudService.toFilterOneQuery(where);

            return this.repo.findOneOrFail(filterQuery, options);
        }

        public async findMany(where?: W, options?: FindOptions<T> | undefined): Promise<T[]> {
            const filterQuery = where && await GeneratedCrudService.toFilterQuery(where);

            const data = filterQuery 
                ? await this.repo.find(filterQuery, options)
                : await this.repo.findAll(options);

            return data;
        }

        public async updateOne(where: W1, update: U, options?: FindOneOptions<T> | undefined): Promise<T> {
            const filterQuery = await GeneratedCrudService.toFilterOneQuery(where);
            const updateInput = await GeneratedCrudService.toUpdateInput(update);

            const entity = await this.repo.findOneOrFail(filterQuery, options);
            this.repo.assign(entity, updateInput);
            this.repo.flush();

            return entity;
        }

        public async updateMany(where: W, update: U, options?: FindOptions<T> | undefined): Promise<T[]> {
            const filterQuery = await GeneratedCrudService.toFilterQuery(where);
            const updateInput = await GeneratedCrudService.toUpdateInput(update);

            const entities = await this.repo.find(filterQuery, options);
            entities.forEach(entity => this.repo.assign(entity, updateInput));
            this.repo.flush();

            return entities;
        }

        public async deleteOne(where: W1, options?: FindOneOptions<T>): Promise<T> {
            const filterQuery = await GeneratedCrudService.toFilterOneQuery(where);
            const entity = await this.repo.findOneOrFail(filterQuery, options);

            await this.repo.removeAndFlush(entity);
            return entity;
        }

        public async deleteMany(where: W, options?: FindOptions<T>): Promise<T[]> {
            const filterQuery = await GeneratedCrudService.toFilterQuery(where);
            const entities = await this.repo.find(filterQuery, options);

            entities.forEach(entity => this.repo.remove(entity));
            return entities;
        }

        public async count(where?: W): Promise<number> {
            const filterQuery = where && await GeneratedCrudService.toFilterQuery(where);

            return this.repo.count(filterQuery);
        }        
    }

    setClassName(GeneratedCrudService, name);

    return GeneratedCrudService;
}