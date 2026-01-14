import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { RefreshTokenRepository } from '#src/contexts/auth/domain/refresh-token-repository.js';
import type { TokenHasher } from '#src/contexts/auth/application/ports/token-hasher.js';
import type { TokenService } from '#src/contexts/auth/application/ports/token-service.js';
import {
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_SERVICE,
} from '#src/contexts/auth/application/ports/tokens.js';

@Injectable()
export class Logout {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasher,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const logoutError = 'Error logging out.';
    let payload: { userId: string; tokenId: string; expiresAt: Date };

    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException(logoutError);
    }

    const storedToken = await this.refreshTokenRepository.findById(payload.tokenId);
    if (!storedToken || storedToken.userId !== payload.userId) {
      throw new UnauthorizedException(logoutError);
    }

    if (storedToken.revokedAt || storedToken.expiresAt.getTime() <= Date.now()) {
      return;
    }

    const matches = await this.tokenHasher.compare(refreshToken, storedToken.tokenHash);
    if (!matches) {
      throw new UnauthorizedException(logoutError);
    }

    await this.refreshTokenRepository.revoke(storedToken.id);
  }
}
