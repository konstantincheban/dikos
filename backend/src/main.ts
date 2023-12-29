import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationFilter } from './utils/filters/validation.filter';
import { ValidationPipe as CustomValidationPipe } from './utils/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 6969;
  console.log("TEST", configService.get('MONGO_HOST'));
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new CustomValidationPipe(),
    new ValidationPipe({
      skipMissingProperties: true,
      // trigger when validation error occur
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errors.map(
          (error) =>
            `${error.property} has wrong value ${error.value}, ${Object.values(
              error.constraints,
            ).join(', ')}`,
        );

        return new BadRequestException(message);
      },
    }),
  );
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(helmet());
  await app.listen(PORT);
}
bootstrap();
