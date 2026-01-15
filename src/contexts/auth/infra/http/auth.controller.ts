import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ChangePassword } from '#src/contexts/auth/application/use-cases/change-password.js';
import { Login } from '#src/contexts/auth/application/use-cases/login.js';
import { Logout } from '#src/contexts/auth/application/use-cases/logout.js';
import { RegisterUser } from '#src/contexts/auth/application/use-cases/register-user.js';
import { RequestPasswordReset } from '#src/contexts/auth/application/use-cases/request-password-reset.js';
import { RefreshAccessToken } from '#src/contexts/auth/application/use-cases/refresh-access-token.js';
import { ResetPassword } from '#src/contexts/auth/application/use-cases/reset-password.js';
import { VerifyUser } from '#src/contexts/auth/application/use-cases/verify-user.js';
import { AuthGuard } from '#src/contexts/auth/infra/http/guards/auth.guard.js';
import { ChangePasswordDto } from '#src/contexts/auth/infra/http/dto/change-password.dto.js';
import { CreateUserDto } from '#src/contexts/auth/infra/http/dto/create-user.dto.js';
import { LoginDto } from '#src/contexts/auth/infra/http/dto/login.dto.js';
import { RefreshTokenDto } from '#src/contexts/auth/infra/http/dto/refresh-token.dto.js';
import { RequestPasswordResetDto } from '#src/contexts/auth/infra/http/dto/request-password-reset.dto.js';
import { VerifyUserDto } from '#src/contexts/auth/infra/http/dto/verify-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly refreshAccessToken: RefreshAccessToken,
    private readonly logoutUseCase: Logout,
    private readonly registerUser: RegisterUser,
    private readonly verifyUser: VerifyUser,
    private readonly changePasswordUseCase: ChangePassword,
    private readonly requestPasswordResetUseCase: RequestPasswordReset,
    private readonly resetPasswordUseCase: ResetPassword,
  ) {}

  @Post('signup')
  create(@Body() body: CreateUserDto) {
    return this.registerUser.execute(body.username, body.email, body.password);
  }

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

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user.');
    }

    return this.changePasswordUseCase.execute(userId, body.currentPassword, body.newPassword);
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.requestPasswordResetUseCase.execute(body.email);
  }

  @Get('reset-password')
  resetPassword(@Query('token') token: string) {
    if (!token || !token.trim()) {
      throw new UnauthorizedException('Missing reset token.');
    }

    return this.resetPasswordUseCase.execute(token);
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
