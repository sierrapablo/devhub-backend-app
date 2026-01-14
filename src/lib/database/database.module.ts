import 'dotenv/config';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from '#src/lib/database/entities/status.entity.js';
import { UserEntity } from '#src/lib/database/entities/user.entity.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: String(process.env.DATABASE_URL ?? ''),
      entities: [UserEntity, StatusEntity],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
