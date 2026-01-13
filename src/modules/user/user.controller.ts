import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
  }
}
