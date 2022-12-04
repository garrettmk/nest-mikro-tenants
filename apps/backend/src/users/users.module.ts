import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntitySchemaRegistry } from '@nest-mikro-tenants/backend/common';
import { User } from '@nest-mikro-tenants/core/domain';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([EntitySchemaRegistry.getEntitySchema(User)])
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}
