import { Body, Controller, Post } from '@nestjs/common';
import { Login } from '#src/contexts/auth/application/use-cases/login.js';
import { Logout } from '#src/contexts/auth/application/use-cases/logout.js';
import { RefreshAccessToken } from '#src/contexts/auth/application/use-cases/refresh-access-token.js';
import { LoginDto } from '#src/contexts/auth/infra/http/dto/login.dto.js';
import { RefreshTokenDto } from '#src/contexts/auth/infra/http/dto/refresh-token.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly refreshAccessToken: RefreshAccessToken,
    private readonly logoutUseCase: Logout,
  ) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body.email, body.password);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto) {
    return this.refreshAccessToken.execute(body.refreshToken);
  }

  @Post('logout')
  logout(@Body() body: RefreshTokenDto) {
    return this.logoutUseCase.execute(body.refreshToken);
  }
}
