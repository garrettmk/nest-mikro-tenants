import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService extends NestConfigService {
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  get isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  get isTesting() {
    return process.env.NODE_ENV === 'test';
  }

  get databaseUrl(): string {
    return this.get('DATABASE_URL');
  }

  get databaseName(): string {
    return this.get('DATABASE_NAME');
  }

  get databaseUser(): string {
    return this.get('DATABASE_USER');
  }

  get databasePassword(): string {
    return this.get('DATABASE_PASSWORD');
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  get jwtExpires(): string {
    return this.get('JWT_EXPIRES');
  }
}
