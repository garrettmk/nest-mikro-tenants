import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { GraphQLModule } from '../graphql/graphql.module';
import { LoggerModule } from '../logger/logger.module';
import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    DatabaseModule,
    GraphQLModule,
    UsersModule,
    TenantsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
