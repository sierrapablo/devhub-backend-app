import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from '#src/contexts/auth/application/use-cases/login.js';
import { Logout } from '#src/contexts/auth/application/use-cases/logout.js';
import { ChangePassword } from '#src/contexts/auth/application/use-cases/change-password.js';
import { RegisterUser } from '#src/contexts/auth/application/use-cases/register-user.js';
import { RequestPasswordReset } from '#src/contexts/auth/application/use-cases/request-password-reset.js';
import { RefreshAccessToken } from '#src/contexts/auth/application/use-cases/refresh-access-token.js';
import { ResetPassword } from '#src/contexts/auth/application/use-cases/reset-password.js';
import { VerifyUser } from '#src/contexts/auth/application/use-cases/verify-user.js';
import {
  PASSWORD_RESET_TOKEN_SERVICE,
  PASSWORD_RESET_WEBHOOK,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_SERVICE,
} from '#src/contexts/auth/application/ports/providers.js';
import {
  PASSWORD_HASHER,
  USER_AUTH_REPOSITORY,
  VERIFICATION_TOKEN_SERVICE,
  VERIFICATION_WEBHOOK,
} from '#src/contexts/auth/application/ports/providers.js';
import { USER_REPOSITORY } from '#src/contexts/user/application/ports/providers.js';
import { RefreshTokenEntity } from '#src/contexts/auth/infra/typeorm/refresh-token.entity.js';
import { TypeOrmRefreshTokenRepository } from '#src/contexts/auth/infra/typeorm/refresh-token.repository.js';
import { JwtTokenService } from '#src/lib/jwt/jwt-token.service.js';
import { BcryptTokenHasher } from '#src/lib/crypto/bcrypt-token-hasher.js';
import { AuthController } from '#src/contexts/auth/infra/http/auth.controller.js';
import { N8nUserVerifyWebhookClient } from '#src/lib/webhooks/n8n-user-verify-webhook.client.js';
import { UserModule } from '#src/contexts/user/infra/user.module.js';
import { JwtVerificationTokenService } from '#src/lib/jwt/verification-token.service.js';
import { BcryptPasswordHasher } from '#src/lib/crypto/bcrypt-password.hasher.js';
import { AuthGuard } from '#src/contexts/auth/infra/http/guards/auth.guard.js';
import { JwtPasswordResetTokenService } from '#src/lib/jwt/password-reset-token.service.js';
import { N8nPasswordResetWebhookClient } from '#src/lib/webhooks/n8n-password-reset-webhook.client.js';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity]), UserModule],
  controllers: [AuthController],
  providers: [
    Login,
    RefreshAccessToken,
    Logout,
    ChangePassword,
    RegisterUser,
    RequestPasswordReset,
    ResetPassword,
    VerifyUser,
    AuthGuard,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: TypeOrmRefreshTokenRepository },
    { provide: USER_AUTH_REPOSITORY, useExisting: USER_REPOSITORY },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: TOKEN_HASHER, useClass: BcryptTokenHasher },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: VERIFICATION_TOKEN_SERVICE, useClass: JwtVerificationTokenService },
    { provide: VERIFICATION_WEBHOOK, useClass: N8nUserVerifyWebhookClient },
    { provide: PASSWORD_RESET_TOKEN_SERVICE, useClass: JwtPasswordResetTokenService },
    { provide: PASSWORD_RESET_WEBHOOK, useClass: N8nPasswordResetWebhookClient },
  ],
})
export class AuthModule {}
