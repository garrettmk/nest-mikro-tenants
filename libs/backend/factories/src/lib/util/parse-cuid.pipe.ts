import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { isCuid } from 'cuid';

@Injectable()
export class ParseCuidPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isCuid(value)) return value;
    else
      throw Object.assign(new ValidationError(), {
        value,
        constraints: {
          isCuid: 'Must be a valid cuid',
        },
      });
  }
}
