import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { TokenService } from '#src/contexts/auth/application/ports/token-service.js';
import {
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from '#src/contexts/auth/application/auth.constants.js';

@Injectable()
export class JwtTokenService implements TokenService {
  signAccessToken(payload: { userId: string; email: string }): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in .env');
    }

    return jwt.sign({ sub: payload.userId, email: payload.email }, jwtSecret, {
      expiresIn: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
    });
  }

  signRefreshToken(payload: { userId: string; tokenId: string }): string {
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET not defined in .env');
    }

    return jwt.sign({ sub: payload.userId, jti: payload.tokenId }, refreshSecret, {
      expiresIn: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
    });
  }

  verifyAccessToken(token: string): { userId: string; email: string; expiresAt: Date } {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in .env');
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === 'string') {
      throw new TypeError('Invalid token payload.');
    }

    const userId = String(decoded.sub ?? '');
    const email = String(decoded.email ?? '');
    const exp = Number(decoded.exp ?? 0);

    if (!userId || !email || !exp) {
      throw new TypeError('Invalid token payload.');
    }

    return { userId, email, expiresAt: new Date(exp * 1000) };
  }

  verifyRefreshToken(token: string): { userId: string; tokenId: string; expiresAt: Date } {
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET not defined in .env');
    }

    const decoded = jwt.verify(token, refreshSecret);
    if (typeof decoded === 'string') {
      throw new TypeError('Invalid token payload.');
    }

    const userId = String(decoded.sub ?? '');
    const tokenId = String(decoded.jti ?? '');
    const exp = Number(decoded.exp ?? 0);

    if (!userId || !tokenId || !exp) {
      throw new TypeError('Invalid token payload.');
    }

    return { userId, tokenId, expiresAt: new Date(exp * 1000) };
  }
}
