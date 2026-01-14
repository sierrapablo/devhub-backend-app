import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { VerificationTokenService } from '#src/contexts/auth/application/ports/verification-token-service.js';

@Injectable()
export class JwtVerificationTokenService implements VerificationTokenService {
  sign(payload: { id: string; email: string }): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in .env');
    }

    return jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
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

    return { id: decoded.id, email: decoded.email };
  }
}
