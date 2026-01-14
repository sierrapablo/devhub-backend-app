import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from '#src/contexts/auth/application/use-cases/login.js';
import { Logout } from '#src/contexts/auth/application/use-cases/logout.js';
import { RefreshAccessToken } from '#src/contexts/auth/application/use-cases/refresh-access-token.js';
import {
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_SERVICE,
} from '#src/contexts/auth/application/ports/tokens.js';
import { RefreshTokenEntity } from '#src/contexts/auth/infra/typeorm/refresh-token.entity.js';
import { TypeOrmRefreshTokenRepository } from '#src/contexts/auth/infra/typeorm/refresh-token.repository.js';
import { JwtTokenService } from '#src/contexts/auth/infra/jwt/jwt-token.service.js';
import { BcryptTokenHasher } from '#src/contexts/auth/infra/crypto/bcrypt-token-hasher.js';
import { AuthController } from '#src/contexts/auth/infra/http/auth.controller.js';
import { UserModule } from '#src/contexts/user/infra/user.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity]), UserModule],
  controllers: [AuthController],
  providers: [
    Login,
    RefreshAccessToken,
    Logout,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: TypeOrmRefreshTokenRepository },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: TOKEN_HASHER, useClass: BcryptTokenHasher },
  ],
})
export class AuthModule {}
