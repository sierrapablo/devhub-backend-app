import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { RefreshTokenRepository } from '#src/contexts/auth/domain/refresh-token-repository.js';
import type { TokenHasher } from '#src/contexts/auth/application/ports/token-hasher.js';
import type { TokenService } from '#src/contexts/auth/application/ports/token-service.js';
import type { AuthTokens } from '#src/contexts/auth/application/dtos/auth-tokens.js';
import type { UserAuthRepository } from '#src/contexts/auth/application/ports/user-auth-repository.js';
import {
  REFRESH_ROTATION_THRESHOLD_MS,
  REFRESH_TOKEN_TTL_MS,
} from '#src/contexts/auth/application/auth.constants.js';
import {
  USER_AUTH_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_SERVICE,
} from '#src/contexts/auth/application/ports/providers.js';

@Injectable()
export class RefreshAccessToken {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasher,
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userRepository: UserAuthRepository,
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    const loginError = 'Error logging in.';
    let payload: { userId: string; tokenId: string; expiresAt: Date };

    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException(loginError);
    }

    const storedToken = await this.refreshTokenRepository.findById(payload.tokenId);
    if (!storedToken || storedToken.userId !== payload.userId) {
      throw new UnauthorizedException(loginError);
    }

    if (storedToken.revokedAt || storedToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException(loginError);
    }

    const matches = await this.tokenHasher.compare(refreshToken, storedToken.tokenHash);
    if (!matches) {
      throw new UnauthorizedException(loginError);
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user || !user.active || !user.verified) {
      throw new UnauthorizedException(loginError);
    }

    const accessToken = this.tokenService.signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const shouldRotate =
      storedToken.expiresAt.getTime() - Date.now() <= REFRESH_ROTATION_THRESHOLD_MS;

    if (!shouldRotate) {
      return { accessToken, refreshToken };
    }

    const newTokenId = randomUUID();
    const newRefreshToken = this.tokenService.signRefreshToken({
      userId: user.id,
      tokenId: newTokenId,
    });
    const tokenHash = await this.tokenHasher.hash(newRefreshToken);

    await this.refreshTokenRepository.create({
      id: newTokenId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      revokedAt: null,
      replacedByTokenId: null,
    });
    await this.refreshTokenRepository.revoke(storedToken.id, newTokenId);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
