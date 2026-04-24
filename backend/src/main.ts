import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestFactory } from '@nestjs/core';
import { ValidationFilter } from '@app/common';
import helmet from 'helmet';

function getCorsOptions(configService: ConfigService): CorsOptions {
  const configuredOrigins = configService
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...configuredOrigins,
  ]);

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      try {
        const { hostname } = new URL(origin);
        callback(
          null,
          hostname.endsWith('.web.app') || hostname.endsWith('.firebaseapp.com'),
        );
      } catch {
        callback(null, false);
      }
    },
    credentials: true,
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<string | number>('PORT') || 6969;
  app.useWebSocketAdapter(new IoAdapter(app))
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    // new CustomValidationPipe(),
    new ValidationPipe({
      whitelist: true, // strip properties not existing in the validation model
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
  app.enableCors(getCorsOptions(configService));
  app.use(helmet());
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
