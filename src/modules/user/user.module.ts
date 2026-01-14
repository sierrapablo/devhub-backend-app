import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '#src/lib/database/entities/user.entity.js';
import { UserController } from '#src/modules/user/user.controller.js';
import { UserService } from '#src/modules/user/user.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
