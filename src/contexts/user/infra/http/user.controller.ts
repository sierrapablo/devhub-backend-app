import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RegisterUser } from '#src/contexts/user/application/use-cases/register-user.js';
import { VerifyUser } from '#src/contexts/user/application/use-cases/verify-user.js';
import { CreateUserDto } from '#src/contexts/user/infra/http/dto/create-user.dto.js';
import { VerifyUserDto } from '#src/contexts/user/infra/http/dto/verify-user.dto.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly verifyUser: VerifyUser,
  ) {}

  @Post('signup')
  create(@Body() body: CreateUserDto) {
    return this.registerUser.execute(body.username, body.email, body.password);
  }

  @Post('verify')
  verify(@Body() body: VerifyUserDto) {
    return this.verifyUser.execute(body.token);
  }

  @Get('verify-token')
  verifyByToken(@Query('token') token: string) {
    return this.verifyUser.execute(token);
  }
}
