import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { PasswordHasher } from '#src/contexts/auth/application/ports/password-hasher.js';
import type { UserAuthRepository } from '#src/contexts/auth/application/ports/user-auth-repository.js';
import { PASSWORD_HASHER, USER_AUTH_REPOSITORY } from '#src/contexts/auth/application/ports/providers.js';

@Injectable()
export class ChangePassword {
  constructor(
    @Inject(USER_AUTH_REPOSITORY)
    private readonly userRepository: UserAuthRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    const changeError = 'Error changing password.';

    if (!user || !user.active || !user.verified) {
      throw new UnauthorizedException(changeError);
    }

    const matches = await this.passwordHasher.compare(currentPassword, user.password);
    if (!matches) {
      throw new UnauthorizedException(changeError);
    }

    const newPasswordHash = await this.passwordHasher.hash(newPassword);
    await this.userRepository.updatePassword(user.id, newPasswordHash);
  }
}
