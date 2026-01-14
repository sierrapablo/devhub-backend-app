import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { VerificationWebhook } from '#src/contexts/auth/application/ports/verification-webhook.js';

@Injectable()
export class N8nWebhookClient implements VerificationWebhook {
  async send(payload: {
    id: string;
    email: string;
    username: string;
    token: string;
    verified: boolean;
  }): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_EMAIL_URL;
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_EMAIL_URL not defined in .env');
    }

    await axios.post(webhookUrl, payload);
  }
}
