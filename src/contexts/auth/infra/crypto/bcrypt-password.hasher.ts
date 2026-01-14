import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { PasswordHasher } from '#src/contexts/user/application/ports/password-hasher.js';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
