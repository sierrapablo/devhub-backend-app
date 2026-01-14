import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PASSWORD_HASHER,
  USER_REPOSITORY,
  VERIFICATION_TOKEN_SERVICE,
  VERIFICATION_WEBHOOK,
} from '#src/contexts/user/application/ports/tokens.js';
import { UserEntity } from '#src/contexts/user/infra/typeorm/user.entity.js';
import { TypeOrmUserRepository } from '#src/contexts/user/infra/typeorm/user.repository.js';
import { BcryptPasswordHasher } from '#src/contexts/user/infra/crypto/bcrypt-password.hasher.js';
import { JwtVerificationTokenService } from '#src/contexts/user/infra/jwt/verification-token.service.js';
import { N8nWebhookClient } from '#src/contexts/user/infra/webhooks/n8n-webhook.client.js';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: VERIFICATION_TOKEN_SERVICE, useClass: JwtVerificationTokenService },
    { provide: VERIFICATION_WEBHOOK, useClass: N8nWebhookClient },
  ],
  exports: [
    USER_REPOSITORY,
    PASSWORD_HASHER,
    VERIFICATION_TOKEN_SERVICE,
    VERIFICATION_WEBHOOK,
  ],
})
export class UserModule {}
