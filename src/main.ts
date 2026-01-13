import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = process.env.API_PREFIX ? String(process.env.API_PREFIX) : '';
  if (prefix) app.setGlobalPrefix(prefix.replace(/^\//, ''));

  const corsOrigins = process.env.CORS_ORIGIN
    ? String(process.env.CORS_ORIGIN)
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : undefined;

  app.enableCors({origin: corsOrigins ?? true});
  app.use(helmet({contentSecurityPolicy: false,}));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(Number(process.env.PORT) || 3000, process.env.HOST || '0.0.0.0');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
