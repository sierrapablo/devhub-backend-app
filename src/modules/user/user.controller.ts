import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '#src/modules/user/user.service.js';
import { LoginDto } from '#src/modules/user/dto/login.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
  }
}
