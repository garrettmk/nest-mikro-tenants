import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(
    private readonly config: ConfigService
  ) { super(); }
}
