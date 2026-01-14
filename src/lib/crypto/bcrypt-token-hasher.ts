import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { TokenHasher } from '#src/contexts/auth/application/ports/token-hasher.js';

@Injectable()
export class BcryptTokenHasher implements TokenHasher {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
