export interface VerificationTokenService {
  sign(payload: { id: string; email: string }): string;
  verify(token: string): { id: string; email: string };
}
