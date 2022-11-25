import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@nest-mikro-tenants/core/domain';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User])
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
