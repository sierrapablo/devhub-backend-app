export interface VerificationWebhook {
  send(payload: { id: string; email: string; username: string; token: string; verified: boolean }): Promise<void>;
}
