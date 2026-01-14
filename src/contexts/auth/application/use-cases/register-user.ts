import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { UserAuthRepository } from '#src/contexts/auth/application/ports/user-auth-repository.js';
import type { UserPublic } from '#src/contexts/user/application/dtos/user-public.js';
import type { PasswordHasher } from '#src/contexts/auth/application/ports/password-hasher.js';
import type { VerificationTokenService } from '#src/contexts/auth/application/ports/verification-token-service.js';
import type { VerificationWebhook } from '#src/contexts/auth/application/ports/verification-webhook.js';
import {
  PASSWORD_HASHER,
  USER_AUTH_REPOSITORY,
  VERIFICATION_TOKEN_SERVICE,
  VERIFICATION_WEBHOOK,
} from '#src/contexts/auth/application/ports/tokens.js';

@Injectable()
export class RegisterUser {
  constructor(
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userRepository: UserAuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(VERIFICATION_TOKEN_SERVICE)
    private readonly tokenService: VerificationTokenService,
    @Inject(VERIFICATION_WEBHOOK)
    private readonly webhook: VerificationWebhook,
  ) {}

  async execute(username: string, email: string, password: string): Promise<UserPublic> {
    const existingUser = await this.userRepository.findByEmailOrUsername(email, username);
    if (existingUser) {
      throw new ConflictException('User already exists.');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = await this.userRepository.create({
      username,
      email,
      password: passwordHash,
      active: true,
      verified: false,
    });

    const verificationToken = this.tokenService.sign({ id: user.id, email: user.email });

    await this.webhook.send({
      id: user.id,
      email: user.email,
      username: user.username,
      token: verificationToken,
      verified: false,
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
