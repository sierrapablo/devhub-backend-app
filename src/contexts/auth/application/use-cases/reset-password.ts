import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import type { PasswordHasher } from '#src/contexts/auth/application/ports/password-hasher.js';
import type { PasswordResetTokenService } from '#src/contexts/auth/application/ports/password-reset-token-service.js';
import type { PasswordResetWebhook } from '#src/contexts/auth/application/ports/password-reset-webhook.js';
import type { UserAuthRepository } from '#src/contexts/auth/application/ports/user-auth-repository.js';
import {
  PASSWORD_HASHER,
  PASSWORD_RESET_TOKEN_SERVICE,
  PASSWORD_RESET_WEBHOOK,
  USER_AUTH_REPOSITORY,
} from '#src/contexts/auth/application/ports/providers.js';

@Injectable()
export class ResetPassword {
  constructor(
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userRepository: UserAuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(PASSWORD_RESET_TOKEN_SERVICE)
    private readonly tokenService: PasswordResetTokenService,
    @Inject(PASSWORD_RESET_WEBHOOK)
    private readonly webhook: PasswordResetWebhook,
  ) {}

  async execute(token: string): Promise<void> {
    const resetError = 'Error resetting password.';
    let payload: { id: string; email: string };

    try {
      payload = this.tokenService.verify(token);
    } catch {
      throw new UnauthorizedException(resetError);
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user || user.email !== payload.email || !user.active) {
      throw new UnauthorizedException(resetError);
    }

    const newPassword = this.generatePassword();
    const newPasswordHash = await this.passwordHasher.hash(newPassword);
    await this.userRepository.updatePassword(user.id, newPasswordHash);

    await this.webhook.send({
      email: user.email,
      password: newPassword,
      'request-reset': false,
    });
  }

  private generatePassword(): string {
    return randomBytes(12).toString('base64url');
  }
}
