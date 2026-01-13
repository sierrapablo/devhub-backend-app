import { Module } from '@nestjs/common';
import { UserController } from '#src/modules/user/user.controller.js';
import { UserService } from '#src/modules/user/user.service.js';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
