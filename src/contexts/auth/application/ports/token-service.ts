export interface TokenService {
  signAccessToken(payload: { userId: string; email: string }): string;
  signRefreshToken(payload: { userId: string; tokenId: string }): string;
  verifyRefreshToken(token: string): { userId: string; tokenId: string; expiresAt: Date };
}
