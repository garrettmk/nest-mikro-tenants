import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tenant } from '@nest-mikro-tenants/core/domain';
import { Module } from '@nestjs/common';
import { TenantsResolver } from './tenants.resolver';
import { TenantsService } from './tenants.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant])
  ],
  providers: [TenantsService, TenantsResolver],
  exports: [TenantsService]
})
export class TenantsModule {}
