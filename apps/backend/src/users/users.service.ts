import { EntityRepository } from '@mikro-orm/postgresql';
import { CrudService } from '@nest-mikro-tenants/backend/factories';
import { User, UserCreateInput, UsersWhereInput, UsersWhereOneInput, UserUpdateInput } from '@nest-mikro-tenants/core/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService extends CrudService(User, UserCreateInput, UserUpdateInput, UsersWhereInput, UsersWhereOneInput) {
    constructor(
        private readonly repo: EntityRepository<User>,
    ) {
        super(repo);
    }


}
