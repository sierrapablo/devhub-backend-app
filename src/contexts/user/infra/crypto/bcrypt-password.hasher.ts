import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { PasswordHasher } from '#src/contexts/user/application/ports/password-hasher.js';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
