import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { PasswordResetTokenService } from '#src/contexts/auth/application/ports/password-reset-token-service.js';
import { PASSWORD_RESET_TOKEN_TTL_MS } from '#src/contexts/auth/application/auth.constants.js';

@Injectable()
export class JwtPasswordResetTokenService implements PasswordResetTokenService {
  sign(payload: { id: string; email: string }): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in .env');
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: Math.floor(PASSWORD_RESET_TOKEN_TTL_MS / 1000),
    });
  }

  verify(token: string): { id: string; email: string } {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in .env');
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === 'string') {
      throw new TypeError('Invalid token payload.');
    }

    const id = String(decoded.id ?? '');
    const email = String(decoded.email ?? '');

    if (!id || !email) {
      throw new TypeError('Invalid token payload.');
    }

    return { id, email };
  }
}
