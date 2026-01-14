export interface PasswordResetWebhook {
  send(payload: {
    email: string;
    token?: string;
    password?: string;
    'request-reset': boolean;
  }): Promise<void>;
}
