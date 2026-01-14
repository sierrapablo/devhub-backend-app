import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { Request } from 'express';
import type { TokenService } from '#src/contexts/auth/application/ports/token-service.js';
import { TOKEN_SERVICE } from '#src/contexts/auth/application/ports/providers.js';

type AuthRequest = Request & { user?: { id: string; email: string } };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const header = request.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing access token.');
    }

    try {
      const payload = this.tokenService.verifyAccessToken(token);
      request.user = { id: payload.userId, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token.');
    }
  }
}
