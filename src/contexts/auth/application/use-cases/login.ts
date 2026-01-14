import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { UserRepository } from '#src/contexts/user/domain/user-repository.js';
import type { PasswordHasher } from '#src/contexts/user/application/ports/password-hasher.js';
import type { RefreshTokenRepository } from '#src/contexts/auth/domain/refresh-token-repository.js';
import type { TokenHasher } from '#src/contexts/auth/application/ports/token-hasher.js';
import type { TokenService } from '#src/contexts/auth/application/ports/token-service.js';
import type { AuthTokens } from '#src/contexts/auth/application/dtos/auth-tokens.js';
import { REFRESH_TOKEN_TTL_MS } from '#src/contexts/auth/application/auth.constants.js';
import { PASSWORD_HASHER, USER_REPOSITORY } from '#src/contexts/user/application/ports/tokens.js';
import {
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_SERVICE,
} from '#src/contexts/auth/application/ports/tokens.js';

@Injectable()
export class Login {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasher,
  ) {}

  async execute(email: string, password: string): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(email);
    const loginError = 'Error logging in.';

    if (!user) throw new UnauthorizedException(loginError);

    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid || !user.active || !user.verified) {
      throw new UnauthorizedException(loginError);
    }

    const accessToken = this.tokenService.signAccessToken({ userId: user.id, email: user.email });

    const tokenId = randomUUID();
    const refreshToken = this.tokenService.signRefreshToken({
      userId: user.id,
      tokenId,
    });
    const tokenHash = await this.tokenHasher.hash(refreshToken);

    await this.refreshTokenRepository.create({
      id: tokenId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      revokedAt: null,
      replacedByTokenId: null,
    });

    return { accessToken, refreshToken };
  }
}
