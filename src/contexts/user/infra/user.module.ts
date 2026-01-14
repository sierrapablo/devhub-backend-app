import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from '#src/contexts/user/application/ports/providers.js';
import { UserEntity } from '#src/contexts/user/infra/typeorm/user.entity.js';
import { TypeOrmUserRepository } from '#src/contexts/user/infra/typeorm/user.repository.js';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
  ],
  exports: [
    USER_REPOSITORY,
  ],
})
export class UserModule {}
