import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from '#src/contexts/auth/application/use-cases/login.js';
import { Logout } from '#src/contexts/auth/application/use-cases/logout.js';
import { ChangePassword } from '#src/contexts/auth/application/use-cases/change-password.js';
import { RegisterUser } from '#src/contexts/auth/application/use-cases/register-user.js';
import { RefreshAccessToken } from '#src/contexts/auth/application/use-cases/refresh-access-token.js';
import { VerifyUser } from '#src/contexts/auth/application/use-cases/verify-user.js';
import {
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
import { N8nWebhookClient } from '#src/lib/webhooks/n8n-webhook.client.js';
import { UserModule } from '#src/contexts/user/infra/user.module.js';
import { JwtVerificationTokenService } from '#src/lib/jwt/verification-token.service.js';
import { BcryptPasswordHasher } from '#src/lib/crypto/bcrypt-password.hasher.js';
import { AuthGuard } from '#src/contexts/auth/infra/http/guards/auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity]), UserModule],
  controllers: [AuthController],
  providers: [
    Login,
    RefreshAccessToken,
    Logout,
    ChangePassword,
    RegisterUser,
    VerifyUser,
    AuthGuard,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: TypeOrmRefreshTokenRepository },
    { provide: USER_AUTH_REPOSITORY, useExisting: USER_REPOSITORY },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: TOKEN_HASHER, useClass: BcryptTokenHasher },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: VERIFICATION_TOKEN_SERVICE, useClass: JwtVerificationTokenService },
    { provide: VERIFICATION_WEBHOOK, useClass: N8nWebhookClient },
  ],
})
export class AuthModule {}
