import { Module } from '@nestjs/common';
import { DatabaseModule } from '#src/lib/database/database.module.js';
import { AuthModule } from '#src/contexts/auth/infra/auth.module.js';
import { UserModule } from '#src/contexts/user/infra/user.module.js';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
})
export class AppModule {}
