import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { UserAuthRepository } from '#src/contexts/auth/application/ports/user-auth-repository.js';
import type { VerificationTokenService } from '#src/contexts/auth/application/ports/verification-token-service.js';
import type { VerificationWebhook } from '#src/contexts/auth/application/ports/verification-webhook.js';
import type { UserPublic } from '#src/contexts/user/application/dtos/user-public.js';
import {
  USER_AUTH_REPOSITORY,
  VERIFICATION_TOKEN_SERVICE,
  VERIFICATION_WEBHOOK,
} from '#src/contexts/auth/application/ports/providers.js';

@Injectable()
export class VerifyUser {
  constructor(
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userRepository: UserAuthRepository,
    @Inject(VERIFICATION_TOKEN_SERVICE)
    private readonly tokenService: VerificationTokenService,
    @Inject(VERIFICATION_WEBHOOK)
    private readonly webhook: VerificationWebhook,
  ) {}

  async execute(token: string): Promise<UserPublic> {
    let payload: { id: string; email: string };

    try {
      payload = this.tokenService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid verification token.');
    }

    const userId = payload.id;
    if (!userId) {
      throw new UnauthorizedException('Invalid verification token.');
    }

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    const user = await this.userRepository.updateVerified(userId, true);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.webhook.send({
      id: user.id,
      email: user.email,
      username: user.username,
      token,
      verified: true,
    });

    return this.toPublicUser(user);
  }

  private toPublicUser(user: {
    id: string;
    username: string;
    email: string;
    active: boolean;
    verified: boolean;
  }): UserPublic {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      active: user.active,
      verified: user.verified,
    };
  }
}
