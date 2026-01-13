import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '#src/modules/user/user.service.js';
import { CreateUserDto } from '#src/modules/user/dto/create-user.dto.js';
import { LoginDto } from '#src/modules/user/dto/login.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/signup')
  create(@Body() body: CreateUserDto) {
    return this.userService.createUser(body.username, body.email, body.password);
  }

  @Post('auth/login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
  }
}
