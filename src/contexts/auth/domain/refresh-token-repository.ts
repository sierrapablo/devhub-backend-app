import type { RefreshToken } from '#src/contexts/auth/domain/refresh-token.js';

export interface RefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findById(id: string): Promise<RefreshToken | null>;
  revoke(id: string, replacedByTokenId?: string): Promise<void>;
}
