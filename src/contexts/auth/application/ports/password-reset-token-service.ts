export interface PasswordResetTokenService {
  sign(payload: { id: string; email: string }): string;
  verify(token: string): { id: string; email: string };
}
