export interface TokenService {
  signAccessToken(payload: { userId: string; email: string }): string;
  signRefreshToken(payload: { userId: string; tokenId: string }): string;
  verifyAccessToken(token: string): { userId: string; email: string; expiresAt: Date };
  verifyRefreshToken(token: string): { userId: string; tokenId: string; expiresAt: Date };
}
