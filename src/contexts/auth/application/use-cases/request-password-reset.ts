import { Inject, Injectable } from '@nestjs/common';
import type { PasswordResetTokenService } from '#src/contexts/auth/application/ports/password-reset-token-service.js';
import type { PasswordResetWebhook } from '#src/contexts/auth/application/ports/password-reset-webhook.js';
import type { UserAuthRepository } from '#src/contexts/auth/application/ports/user-auth-repository.js';
import {
  PASSWORD_RESET_TOKEN_SERVICE,
  PASSWORD_RESET_WEBHOOK,
  USER_AUTH_REPOSITORY,
} from '#src/contexts/auth/application/ports/providers.js';

@Injectable()
export class RequestPasswordReset {
  constructor(
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userRepository: UserAuthRepository,
    @Inject(PASSWORD_RESET_TOKEN_SERVICE)
    private readonly tokenService: PasswordResetTokenService,
    @Inject(PASSWORD_RESET_WEBHOOK)
    private readonly webhook: PasswordResetWebhook,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user?.active) {
      return;
    }

    const token = this.tokenService.sign({ id: user.id, email: user.email });
    await this.webhook.send({
      email: user.email,
      token,
      'request-reset': true,
    });
  }
}
