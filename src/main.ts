import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = process.env.API_PREFIX ? String(process.env.API_PREFIX) : '';
  if (prefix) app.setGlobalPrefix(prefix.replace(/^\//, ''));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(
    Number(process.env.PORT) || 3000,
    process.env.HOST || '0.0.0.0',
  );
}

bootstrap();
