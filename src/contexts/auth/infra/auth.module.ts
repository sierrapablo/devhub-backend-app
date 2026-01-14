import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from '#src/contexts/auth/application/use-cases/login.js';
import { Logout } from '#src/contexts/auth/application/use-cases/logout.js';
import { RegisterUser } from '#src/contexts/auth/application/use-cases/register-user.js';
import { RefreshAccessToken } from '#src/contexts/auth/application/use-cases/refresh-access-token.js';
import { VerifyUser } from '#src/contexts/auth/application/use-cases/verify-user.js';
import {
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_SERVICE,
} from '#src/contexts/auth/application/ports/tokens.js';
import {
  PASSWORD_HASHER,
  VERIFICATION_TOKEN_SERVICE,
  VERIFICATION_WEBHOOK,
} from '#src/contexts/user/application/ports/tokens.js';
import { RefreshTokenEntity } from '#src/contexts/auth/infra/typeorm/refresh-token.entity.js';
import { TypeOrmRefreshTokenRepository } from '#src/contexts/auth/infra/typeorm/refresh-token.repository.js';
import { JwtTokenService } from '#src/contexts/auth/infra/jwt/jwt-token.service.js';
import { BcryptTokenHasher } from '#src/contexts/auth/infra/crypto/bcrypt-token-hasher.js';
import { AuthController } from '#src/contexts/auth/infra/http/auth.controller.js';
import { N8nWebhookClient } from '#src/contexts/auth/infra/webhooks/n8n-webhook.client.js';
import { UserModule } from '#src/contexts/user/infra/user.module.js';
import { JwtVerificationTokenService } from '#src/contexts/auth/infra/jwt/verification-token.service.js';
import { BcryptPasswordHasher } from '#src/contexts/auth/infra/crypto/bcrypt-password.hasher.js';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity]), UserModule],
  controllers: [AuthController],
  providers: [
    Login,
    RefreshAccessToken,
    Logout,
    RegisterUser,
    VerifyUser,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: TypeOrmRefreshTokenRepository },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: TOKEN_HASHER, useClass: BcryptTokenHasher },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: VERIFICATION_TOKEN_SERVICE, useClass: JwtVerificationTokenService },
    { provide: VERIFICATION_WEBHOOK, useClass: N8nWebhookClient },
  ],
})
export class AuthModule {}
