import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '../config/config.service';
import './register-entities';

@Module({
    imports: [
        MikroOrmModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                autoLoadEntities: true,
                type: 'postgresql',
                clientUrl: config.databaseUrl,
                dbName: config.databaseName,
                user: config.databaseUser,
                password: config.databasePassword
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}
