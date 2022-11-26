import { CrudResolvers } from "@nest-mikro-tenants/backend/factories";
import { PaginatedUsers, User, UserCreateInput, UsersWhereInput, UsersWhereOneInput, UserUpdateInput } from "@nest-mikro-tenants/core/domain";
import { Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";

@Resolver()
export class UsersResolver extends CrudResolvers(
    User,
    UserCreateInput,
    UserUpdateInput,
    UsersWhereInput,
    UsersWhereOneInput,
    PaginatedUsers
) {
    constructor(service: UsersService) {
        super(service);
    }
}