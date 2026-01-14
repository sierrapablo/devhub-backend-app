import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { PasswordResetWebhook } from '#src/contexts/auth/application/ports/password-reset-webhook.js';

@Injectable()
export class N8nPasswordResetWebhookClient implements PasswordResetWebhook {
  async send(payload: {
    email: string;
    token?: string;
    password?: string;
    'request-reset': boolean;
  }): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_PASSWORD_RESET_URL;
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_PASSWORD_RESET_URL not defined in .env');
    }

    await axios.post(webhookUrl, payload);
  }
}
