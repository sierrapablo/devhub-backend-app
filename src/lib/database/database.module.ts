import 'dotenv/config';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '#src/contexts/auth/infra/typeorm/refresh-token.entity.js';
import { UserEntity } from '#src/contexts/user/infra/typeorm/user.entity.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: String(process.env.DATABASE_URL ?? ''),
      entities: [UserEntity, RefreshTokenEntity],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
