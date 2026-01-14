import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { TokenHasher } from '#src/contexts/auth/application/ports/token-hasher.js';

@Injectable()
export class BcryptTokenHasher implements TokenHasher {
  async hash(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  async compare(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }
}
